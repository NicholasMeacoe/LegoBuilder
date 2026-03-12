import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { LegoPart, BuildSuggestion } from '@/types';

let db: Database | null = null;

export async function getDb() {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'rebrickable.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  return db;
}

export async function findBuildsFromLocalDb(inventory: LegoPart[]): Promise<BuildSuggestion[]> {
  const db = await getDb();
  
  if (inventory.length === 0) return [];

  // Create a temporary table for the user's current inventory for efficient joining
  await db.exec('CREATE TEMP TABLE IF NOT EXISTS user_inventory (part_num TEXT, quantity INTEGER)');
  await db.exec('DELETE FROM user_inventory');
  
  const stmt = await db.prepare('INSERT INTO user_inventory VALUES (?, ?)');
  for (const part of inventory) {
    await stmt.run(part.id, part.quantity);
  }
  await stmt.finalize();

  // Find sets that contain at least one of the user's parts
  // And calculate what percentage of the set's parts the user has
  const query = `
    WITH set_parts_count AS (
      SELECT 
        i.set_num, 
        SUM(ip.quantity) as total_parts_needed
      FROM inventories i
      JOIN inventory_parts ip ON i.id = ip.inventory_id
      GROUP BY i.set_num
    ),
    user_match_count AS (
      SELECT 
        i.set_num,
        SUM(MIN(ip.quantity, ui.quantity)) as matched_parts
      FROM inventories i
      JOIN inventory_parts ip ON i.id = ip.inventory_id
      JOIN user_inventory ui ON ip.part_num = ui.part_num
      GROUP BY i.set_num
    )
    SELECT 
      s.set_num as setNum,
      s.name,
      s.year,
      s.theme_id as themeId,
      s.num_parts as numParts,
      s.img_url as imageUrl,
      (CAST(umc.matched_parts AS FLOAT) / spc.total_parts_needed) * 100 as matchPercentage
    FROM sets s
    JOIN user_match_count umc ON s.set_num = umc.set_num
    JOIN set_parts_count spc ON s.set_num = spc.set_num
    WHERE matchPercentage > 10
    ORDER BY matchPercentage DESC
    LIMIT 20
  `;

  const results = await db.all(query);

  return results.map(row => ({
    ...row,
    url: `https://rebrickable.com/sets/${row.setNum}/`,
    // If imageUrl is empty in the CSV, we'll need to fallback to the API later or use a default
    imageUrl: row.imageUrl || `https://cdn.rebrickable.com/media/sets/${row.setNum}.jpg`
  }));
}
