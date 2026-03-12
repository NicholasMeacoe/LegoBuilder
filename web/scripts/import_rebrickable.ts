import axios from 'axios';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import csv from 'csv-parser';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'rebrickable.db');
const BASE_URL = 'https://rebrickable.com/media/downloads/';

const FILES = [
  'colors.csv.gz',
  'parts.csv.gz',
  'sets.csv.gz',
  'themes.csv.gz',
  'inventories.csv.gz',
  'inventory_parts.csv.gz'
];

async function downloadAndImport() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  console.log('Database opened.');

  for (const fileName of FILES) {
    const tableName = fileName.replace('.csv.gz', '');
    const localPath = path.join(DATA_DIR, fileName);
    const url = `${BASE_URL}${fileName}`;

    console.log(`Processing ${fileName}...`);

    // Download
    console.log(`Downloading ${url}...`);
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Create table (drop if exists for clean import)
    // We'll infer columns from the first row of CSV
    await db.exec(`DROP TABLE IF EXISTS ${tableName}`);

    let columns: string[] = [];
    let isHeader = true;

    const stream = fs.createReadStream(localPath)
      .pipe(zlib.createGunzip())
      .pipe(csv());

    let count = 0;
    let placeholders = '';
    let insertStmt: any;

    await db.exec('BEGIN TRANSACTION');

    for await (const row of stream) {
      if (isHeader) {
        columns = Object.keys(row);
        const colDef = columns.map(c => `"${c}" TEXT`).join(', ');
        await db.exec(`CREATE TABLE ${tableName} (${colDef})`);
        placeholders = columns.map(() => '?').join(', ');
        insertStmt = await db.prepare(`INSERT INTO ${tableName} VALUES (${placeholders})`);
        isHeader = false;
      }

      await insertStmt.run(Object.values(row));
      count++;
      if (count % 10000 === 0) {
        console.log(`Imported ${count} rows into ${tableName}...`);
        await db.exec('COMMIT');
        await db.exec('BEGIN TRANSACTION');
      }
    }

    await db.exec('COMMIT');
    if (insertStmt) await insertStmt.finalize();

    console.log(`Finished importing ${count} rows into ${tableName}.`);
    
    // Clean up
    fs.unlinkSync(localPath);
  }

  // Create indexes for performance
  console.log('Creating indexes...');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_inventory_parts_part_num ON inventory_parts (part_num)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_inventories_set_num ON inventories (set_num)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_inventory_parts_inventory_id ON inventory_parts (inventory_id)');

  await db.close();
  console.log('Import complete.');
}

downloadAndImport().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
