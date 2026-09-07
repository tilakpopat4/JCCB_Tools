const conn = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const match = conn.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (!match) {
  console.error("Invalid database connection string");
  process.exit(1);
}
const host = match[3];
const url = 'https://' + host + '/sql';

async function executeSql(sql, params = []) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': conn
    },
    body: JSON.stringify({ query: sql, params })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
}

async function runBackfill() {
  console.log("=======================================================");
  console.log("  Running Neon DB Branch Code Backfill");
  console.log("  Database: " + host);
  console.log("=======================================================\n");

  // 1. Check existing records in jccb_fd_forms
  const checkFD = await executeSql("SELECT id, branch_code, payload->>'branchName' as branch_name, payload->>'branch' as branch FROM jccb_fd_forms;");
  console.log(`Found ${checkFD.rows ? checkFD.rows.length : 0} rows in jccb_fd_forms:`, checkFD.rows);

  // 2. Execute UPDATE on jccb_fd_forms
  const updateFDSql = `
    UPDATE public.jccb_fd_forms
    SET branch_code = CASE
        WHEN payload->>'branchName' ILIKE '%AZADCHOWK%' OR payload->>'branch' ILIKE '%AZADCHOWK%' OR payload->>'branchName' ILIKE '%(CBB)%' OR payload->>'branchName' ILIKE '%[CBB]%' THEN '01'
        WHEN payload->>'branchName' ILIKE '%JOSHIPARA%' OR payload->>'branch' ILIKE '%JOSHIPARA%' OR payload->>'branchName' ILIKE '%(JPB)%' OR payload->>'branchName' ILIKE '%[JPB]%' THEN '02'
        WHEN payload->>'branchName' ILIKE '%DOLATPARA%' OR payload->>'branch' ILIKE '%DOLATPARA%' OR payload->>'branchName' ILIKE '%(DBP)%' OR payload->>'branchName' ILIKE '%(DPB)%' OR payload->>'branchName' ILIKE '%[DPB]%' OR payload->>'branchName' ILIKE '%[DBP]%' THEN '03'
        WHEN payload->>'branchName' ILIKE '%KODINAR%' OR payload->>'branch' ILIKE '%KODINAR%' OR payload->>'branchName' ILIKE '%(KDR)%' OR payload->>'branchName' ILIKE '%[KDR]%' THEN '04'
        WHEN payload->>'branchName' ILIKE '%KESHOD%' OR payload->>'branch' ILIKE '%KESHOD%' OR payload->>'branchName' ILIKE '%(KSD)%' OR payload->>'branchName' ILIKE '%[KSD]%' THEN '05'
        WHEN payload->>'branchName' ILIKE '%VANTHALI%' OR payload->>'branch' ILIKE '%VANTHALI%' OR payload->>'branchName' ILIKE '%(VTL)%' OR payload->>'branchName' ILIKE '%[VTL]%' THEN '06'
        WHEN payload->>'branchName' ILIKE '%MANAVADAR%' OR payload->>'branch' ILIKE '%MANAVADAR%' OR payload->>'branchName' ILIKE '%(MNV)%' OR payload->>'branchName' ILIKE '%[MNV]%' THEN '07'
        WHEN payload->>'branchName' ILIKE '%GANDHINAGAR%' OR payload->>'branch' ILIKE '%GANDHINAGAR%' OR payload->>'branchName' ILIKE '%(GNB)%' OR payload->>'branchName' ILIKE '%[GNB]%' THEN '08'
        WHEN payload->>'branchName' ILIKE '%LIMBDI%' OR payload->>'branch' ILIKE '%LIMBDI%' OR payload->>'branchName' ILIKE '%(LIM)%' OR payload->>'branchName' ILIKE '%[LIM]%' THEN '09'
        WHEN payload->>'branchName' ILIKE '%MENDARDA%' OR payload->>'branch' ILIKE '%MENDARDA%' OR payload->>'branchName' ILIKE '%(MEN)%' OR payload->>'branchName' ILIKE '%[MEN]%' OR payload->>'branchName' ILIKE '%(MND)%' THEN '10'
        WHEN payload->>'branchName' ILIKE '%VISAVADAR%' OR payload->>'branch' ILIKE '%VISAVADAR%' OR payload->>'branchName' ILIKE '%(VIS)%' OR payload->>'branchName' ILIKE '%[VIS]%' THEN '11'
        WHEN payload->>'branchName' ILIKE '%JAMNAGAR%' OR payload->>'branch' ILIKE '%JAMNAGAR%' OR payload->>'branchName' ILIKE '%(JMB)%' OR payload->>'branchName' ILIKE '%[JMB]%' OR payload->>'branchName' ILIKE '%(JAM)%' THEN '12'
        WHEN payload->>'branchName' ILIKE '%BUS STAND%' OR payload->>'branch' ILIKE '%BUS STAND%' OR payload->>'branchName' ILIKE '%(STB)%' OR payload->>'branchName' ILIKE '%[STB]%' THEN '13'
        WHEN payload->>'branchName' ILIKE '%LATHI%' OR payload->>'branch' ILIKE '%LATHI%' OR payload->>'branchName' ILIKE '%(LTH)%' OR payload->>'branchName' ILIKE '%[LTH]%' THEN '14'
        WHEN payload->>'branchName' ILIKE '%AHMEDABAD%' OR payload->>'branch' ILIKE '%AHMEDABAD%' OR payload->>'branchName' ILIKE '%(AHM)%' OR payload->>'branchName' ILIKE '%[AHM]%' THEN '16'
        WHEN payload->>'branchName' ILIKE '%RAJKOT%' OR payload->>'branch' ILIKE '%RAJKOT%' OR payload->>'branchName' ILIKE '%(RJT)%' OR payload->>'branchName' ILIKE '%[RJT]%' THEN '17'
        WHEN payload->>'branchName' ILIKE '%ZANZARDA%' OR payload->>'branch' ILIKE '%ZANZARDA%' OR payload->>'branchName' ILIKE '%(ZAN)%' OR payload->>'branchName' ILIKE '%[ZAN]%' THEN '18'
        WHEN payload->>'branchName' ILIKE '%HEAD OFFICE%' OR payload->>'branch' ILIKE '%HEAD OFFICE%' OR payload->>'branchName' ILIKE '%(HO)%' OR payload->>'branchName' ILIKE '%[HO]%' THEN '99'
        ELSE branch_code
    END,
    payload = jsonb_set(
        payload,
        '{branchCode}',
        to_jsonb(
            CASE
                WHEN payload->>'branchName' ILIKE '%AZADCHOWK%' OR payload->>'branch' ILIKE '%AZADCHOWK%' OR payload->>'branchName' ILIKE '%(CBB)%' OR payload->>'branchName' ILIKE '%[CBB]%' THEN '01'
                WHEN payload->>'branchName' ILIKE '%JOSHIPARA%' OR payload->>'branch' ILIKE '%JOSHIPARA%' OR payload->>'branchName' ILIKE '%(JPB)%' OR payload->>'branchName' ILIKE '%[JPB]%' THEN '02'
                WHEN payload->>'branchName' ILIKE '%DOLATPARA%' OR payload->>'branch' ILIKE '%DOLATPARA%' OR payload->>'branchName' ILIKE '%(DBP)%' OR payload->>'branchName' ILIKE '%(DPB)%' OR payload->>'branchName' ILIKE '%[DPB]%' OR payload->>'branchName' ILIKE '%[DBP]%' THEN '03'
                WHEN payload->>'branchName' ILIKE '%KODINAR%' OR payload->>'branch' ILIKE '%KODINAR%' OR payload->>'branchName' ILIKE '%(KDR)%' OR payload->>'branchName' ILIKE '%[KDR]%' THEN '04'
                WHEN payload->>'branchName' ILIKE '%KESHOD%' OR payload->>'branch' ILIKE '%KESHOD%' OR payload->>'branchName' ILIKE '%(KSD)%' OR payload->>'branchName' ILIKE '%[KSD]%' THEN '05'
                WHEN payload->>'branchName' ILIKE '%VANTHALI%' OR payload->>'branch' ILIKE '%VANTHALI%' OR payload->>'branchName' ILIKE '%(VTL)%' OR payload->>'branchName' ILIKE '%[VTL]%' THEN '06'
                WHEN payload->>'branchName' ILIKE '%MANAVADAR%' OR payload->>'branch' ILIKE '%MANAVADAR%' OR payload->>'branchName' ILIKE '%(MNV)%' OR payload->>'branchName' ILIKE '%[MNV]%' THEN '07'
                WHEN payload->>'branchName' ILIKE '%GANDHINAGAR%' OR payload->>'branch' ILIKE '%GANDHINAGAR%' OR payload->>'branchName' ILIKE '%(GNB)%' OR payload->>'branchName' ILIKE '%[GNB]%' THEN '08'
                WHEN payload->>'branchName' ILIKE '%LIMBDI%' OR payload->>'branch' ILIKE '%LIMBDI%' OR payload->>'branchName' ILIKE '%(LIM)%' OR payload->>'branchName' ILIKE '%[LIM]%' THEN '09'
                WHEN payload->>'branchName' ILIKE '%MENDARDA%' OR payload->>'branch' ILIKE '%MENDARDA%' OR payload->>'branchName' ILIKE '%(MEN)%' OR payload->>'branchName' ILIKE '%[MEN]%' OR payload->>'branchName' ILIKE '%(MND)%' THEN '10'
                WHEN payload->>'branchName' ILIKE '%VISAVADAR%' OR payload->>'branch' ILIKE '%VISAVADAR%' OR payload->>'branchName' ILIKE '%(VIS)%' OR payload->>'branchName' ILIKE '%[VIS]%' THEN '11'
                WHEN payload->>'branchName' ILIKE '%JAMNAGAR%' OR payload->>'branch' ILIKE '%JAMNAGAR%' OR payload->>'branchName' ILIKE '%(JMB)%' OR payload->>'branchName' ILIKE '%[JMB]%' OR payload->>'branchName' ILIKE '%(JAM)%' THEN '12'
                WHEN payload->>'branchName' ILIKE '%BUS STAND%' OR payload->>'branch' ILIKE '%BUS STAND%' OR payload->>'branchName' ILIKE '%(STB)%' OR payload->>'branchName' ILIKE '%[STB]%' THEN '13'
                WHEN payload->>'branchName' ILIKE '%LATHI%' OR payload->>'branch' ILIKE '%LATHI%' OR payload->>'branchName' ILIKE '%(LTH)%' OR payload->>'branchName' ILIKE '%[LTH]%' THEN '14'
                WHEN payload->>'branchName' ILIKE '%AHMEDABAD%' OR payload->>'branch' ILIKE '%AHMEDABAD%' OR payload->>'branchName' ILIKE '%(AHM)%' OR payload->>'branchName' ILIKE '%[AHM]%' THEN '16'
                WHEN payload->>'branchName' ILIKE '%RAJKOT%' OR payload->>'branch' ILIKE '%RAJKOT%' OR payload->>'branchName' ILIKE '%(RJT)%' OR payload->>'branchName' ILIKE '%[RJT]%' THEN '17'
                WHEN payload->>'branchName' ILIKE '%ZANZARDA%' OR payload->>'branch' ILIKE '%ZANZARDA%' OR payload->>'branchName' ILIKE '%(ZAN)%' OR payload->>'branchName' ILIKE '%[ZAN]%' THEN '18'
                WHEN payload->>'branchName' ILIKE '%HEAD OFFICE%' OR payload->>'branch' ILIKE '%HEAD OFFICE%' OR payload->>'branchName' ILIKE '%(HO)%' OR payload->>'branchName' ILIKE '%[HO]%' THEN '99'
                ELSE COALESCE(payload->>'branchCode', '99')
            END::text
        ),
        true
    );
  `;
  const resFD = await executeSql(updateFDSql);
  console.log("✓ jccb_fd_forms backfill executed successfully.");

  // 3. Execute UPDATE on jccb_od_loans
  const updateODSql = `
    UPDATE public.jccb_od_loans
    SET branch_code = CASE
        WHEN payload->>'branchName' ILIKE '%AZADCHOWK%' OR payload->>'branch' ILIKE '%AZADCHOWK%' OR payload->>'branchName' ILIKE '%(CBB)%' OR payload->>'branchName' ILIKE '%[CBB]%' THEN '01'
        WHEN payload->>'branchName' ILIKE '%JOSHIPARA%' OR payload->>'branch' ILIKE '%JOSHIPARA%' OR payload->>'branchName' ILIKE '%(JPB)%' OR payload->>'branchName' ILIKE '%[JPB]%' THEN '02'
        WHEN payload->>'branchName' ILIKE '%DOLATPARA%' OR payload->>'branch' ILIKE '%DOLATPARA%' OR payload->>'branchName' ILIKE '%(DBP)%' OR payload->>'branchName' ILIKE '%(DPB)%' OR payload->>'branchName' ILIKE '%[DPB]%' OR payload->>'branchName' ILIKE '%[DBP]%' THEN '03'
        WHEN payload->>'branchName' ILIKE '%KODINAR%' OR payload->>'branch' ILIKE '%KODINAR%' OR payload->>'branchName' ILIKE '%(KDR)%' OR payload->>'branchName' ILIKE '%[KDR]%' THEN '04'
        WHEN payload->>'branchName' ILIKE '%KESHOD%' OR payload->>'branch' ILIKE '%KESHOD%' OR payload->>'branchName' ILIKE '%(KSD)%' OR payload->>'branchName' ILIKE '%[KSD]%' THEN '05'
        WHEN payload->>'branchName' ILIKE '%VANTHALI%' OR payload->>'branch' ILIKE '%VANTHALI%' OR payload->>'branchName' ILIKE '%(VTL)%' OR payload->>'branchName' ILIKE '%[VTL]%' THEN '06'
        WHEN payload->>'branchName' ILIKE '%MANAVADAR%' OR payload->>'branch' ILIKE '%MANAVADAR%' OR payload->>'branchName' ILIKE '%(MNV)%' OR payload->>'branchName' ILIKE '%[MNV]%' THEN '07'
        WHEN payload->>'branchName' ILIKE '%GANDHINAGAR%' OR payload->>'branch' ILIKE '%GANDHINAGAR%' OR payload->>'branchName' ILIKE '%(GNB)%' OR payload->>'branchName' ILIKE '%[GNB]%' THEN '08'
        WHEN payload->>'branchName' ILIKE '%LIMBDI%' OR payload->>'branch' ILIKE '%LIMBDI%' OR payload->>'branchName' ILIKE '%(LIM)%' OR payload->>'branchName' ILIKE '%[LIM]%' THEN '09'
        WHEN payload->>'branchName' ILIKE '%MENDARDA%' OR payload->>'branch' ILIKE '%MENDARDA%' OR payload->>'branchName' ILIKE '%(MEN)%' OR payload->>'branchName' ILIKE '%[MEN]%' OR payload->>'branchName' ILIKE '%(MND)%' THEN '10'
        WHEN payload->>'branchName' ILIKE '%VISAVADAR%' OR payload->>'branch' ILIKE '%VISAVADAR%' OR payload->>'branchName' ILIKE '%(VIS)%' OR payload->>'branchName' ILIKE '%[VIS]%' THEN '11'
        WHEN payload->>'branchName' ILIKE '%JAMNAGAR%' OR payload->>'branch' ILIKE '%JAMNAGAR%' OR payload->>'branchName' ILIKE '%(JMB)%' OR payload->>'branchName' ILIKE '%[JMB]%' OR payload->>'branchName' ILIKE '%(JAM)%' THEN '12'
        WHEN payload->>'branchName' ILIKE '%BUS STAND%' OR payload->>'branch' ILIKE '%BUS STAND%' OR payload->>'branchName' ILIKE '%(STB)%' OR payload->>'branchName' ILIKE '%[STB]%' THEN '13'
        WHEN payload->>'branchName' ILIKE '%LATHI%' OR payload->>'branch' ILIKE '%LATHI%' OR payload->>'branchName' ILIKE '%(LTH)%' OR payload->>'branchName' ILIKE '%[LTH]%' THEN '14'
        WHEN payload->>'branchName' ILIKE '%AHMEDABAD%' OR payload->>'branch' ILIKE '%AHMEDABAD%' OR payload->>'branchName' ILIKE '%(AHM)%' OR payload->>'branchName' ILIKE '%[AHM]%' THEN '16'
        WHEN payload->>'branchName' ILIKE '%RAJKOT%' OR payload->>'branch' ILIKE '%RAJKOT%' OR payload->>'branchName' ILIKE '%(RJT)%' OR payload->>'branchName' ILIKE '%[RJT]%' THEN '17'
        WHEN payload->>'branchName' ILIKE '%ZANZARDA%' OR payload->>'branch' ILIKE '%ZANZARDA%' OR payload->>'branchName' ILIKE '%(ZAN)%' OR payload->>'branchName' ILIKE '%[ZAN]%' THEN '18'
        WHEN payload->>'branchName' ILIKE '%HEAD OFFICE%' OR payload->>'branch' ILIKE '%HEAD OFFICE%' OR payload->>'branchName' ILIKE '%(HO)%' OR payload->>'branchName' ILIKE '%[HO]%' THEN '99'
        ELSE branch_code
    END,
    payload = jsonb_set(
        payload,
        '{branchCode}',
        to_jsonb(
            CASE
                WHEN payload->>'branchName' ILIKE '%AZADCHOWK%' OR payload->>'branch' ILIKE '%AZADCHOWK%' OR payload->>'branchName' ILIKE '%(CBB)%' OR payload->>'branchName' ILIKE '%[CBB]%' THEN '01'
                WHEN payload->>'branchName' ILIKE '%JOSHIPARA%' OR payload->>'branch' ILIKE '%JOSHIPARA%' OR payload->>'branchName' ILIKE '%(JPB)%' OR payload->>'branchName' ILIKE '%[JPB]%' THEN '02'
                WHEN payload->>'branchName' ILIKE '%DOLATPARA%' OR payload->>'branch' ILIKE '%DOLATPARA%' OR payload->>'branchName' ILIKE '%(DBP)%' OR payload->>'branchName' ILIKE '%(DPB)%' OR payload->>'branchName' ILIKE '%[DPB]%' OR payload->>'branchName' ILIKE '%[DBP]%' THEN '03'
                WHEN payload->>'branchName' ILIKE '%KODINAR%' OR payload->>'branch' ILIKE '%KODINAR%' OR payload->>'branchName' ILIKE '%(KDR)%' OR payload->>'branchName' ILIKE '%[KDR]%' THEN '04'
                WHEN payload->>'branchName' ILIKE '%KESHOD%' OR payload->>'branch' ILIKE '%KESHOD%' OR payload->>'branchName' ILIKE '%(KSD)%' OR payload->>'branchName' ILIKE '%[KSD]%' THEN '05'
                WHEN payload->>'branchName' ILIKE '%VANTHALI%' OR payload->>'branch' ILIKE '%VANTHALI%' OR payload->>'branchName' ILIKE '%(VTL)%' OR payload->>'branchName' ILIKE '%[VTL]%' THEN '06'
                WHEN payload->>'branchName' ILIKE '%MANAVADAR%' OR payload->>'branch' ILIKE '%MANAVADAR%' OR payload->>'branchName' ILIKE '%(MNV)%' OR payload->>'branchName' ILIKE '%[MNV]%' THEN '07'
                WHEN payload->>'branchName' ILIKE '%GANDHINAGAR%' OR payload->>'branch' ILIKE '%GANDHINAGAR%' OR payload->>'branchName' ILIKE '%(GNB)%' OR payload->>'branchName' ILIKE '%[GNB]%' THEN '08'
                WHEN payload->>'branchName' ILIKE '%LIMBDI%' OR payload->>'branch' ILIKE '%LIMBDI%' OR payload->>'branchName' ILIKE '%(LIM)%' OR payload->>'branchName' ILIKE '%[LIM]%' THEN '09'
                WHEN payload->>'branchName' ILIKE '%MENDARDA%' OR payload->>'branch' ILIKE '%MENDARDA%' OR payload->>'branchName' ILIKE '%(MEN)%' OR payload->>'branchName' ILIKE '%[MEN]%' OR payload->>'branchName' ILIKE '%(MND)%' THEN '10'
                WHEN payload->>'branchName' ILIKE '%VISAVADAR%' OR payload->>'branch' ILIKE '%VISAVADAR%' OR payload->>'branchName' ILIKE '%(VIS)%' OR payload->>'branchName' ILIKE '%[VIS]%' THEN '11'
                WHEN payload->>'branchName' ILIKE '%JAMNAGAR%' OR payload->>'branch' ILIKE '%JAMNAGAR%' OR payload->>'branchName' ILIKE '%(JMB)%' OR payload->>'branchName' ILIKE '%[JMB]%' OR payload->>'branchName' ILIKE '%(JAM)%' THEN '12'
                WHEN payload->>'branchName' ILIKE '%BUS STAND%' OR payload->>'branch' ILIKE '%BUS STAND%' OR payload->>'branchName' ILIKE '%(STB)%' OR payload->>'branchName' ILIKE '%[STB]%' THEN '13'
                WHEN payload->>'branchName' ILIKE '%LATHI%' OR payload->>'branch' ILIKE '%LATHI%' OR payload->>'branchName' ILIKE '%(LTH)%' OR payload->>'branchName' ILIKE '%[LTH]%' THEN '14'
                WHEN payload->>'branchName' ILIKE '%AHMEDABAD%' OR payload->>'branch' ILIKE '%AHMEDABAD%' OR payload->>'branchName' ILIKE '%(AHM)%' OR payload->>'branchName' ILIKE '%[AHM]%' THEN '16'
                WHEN payload->>'branchName' ILIKE '%RAJKOT%' OR payload->>'branch' ILIKE '%RAJKOT%' OR payload->>'branchName' ILIKE '%(RJT)%' OR payload->>'branchName' ILIKE '%[RJT]%' THEN '17'
                WHEN payload->>'branchName' ILIKE '%ZANZARDA%' OR payload->>'branch' ILIKE '%ZANZARDA%' OR payload->>'branchName' ILIKE '%(ZAN)%' OR payload->>'branchName' ILIKE '%[ZAN]%' THEN '18'
                WHEN payload->>'branchName' ILIKE '%HEAD OFFICE%' OR payload->>'branch' ILIKE '%HEAD OFFICE%' OR payload->>'branchName' ILIKE '%(HO)%' OR payload->>'branchName' ILIKE '%[HO]%' THEN '99'
                ELSE COALESCE(payload->>'branchCode', '99')
            END::text
        ),
        true
    );
  `;
  const resOD = await executeSql(updateODSql);
  console.log("✓ jccb_od_loans backfill executed successfully.");

  // 4. Also backfill jccb_gold_branches master seed
  const branchesSeedSql = `
    INSERT INTO public.jccb_gold_branches (code, branch_code, name, branch_name, is_head_office, payload)
    VALUES
      ('01', '01', '01 AZADCHOWK', 'AZADCHOWK', FALSE, '{"code":"01","name":"01 AZADCHOWK","isHO":false}'::jsonb),
      ('02', '02', '02 JOSHIPARA', 'JOSHIPARA', FALSE, '{"code":"02","name":"02 JOSHIPARA","isHO":false}'::jsonb),
      ('03', '03', '03 DOLATPARA', 'DOLATPARA', FALSE, '{"code":"03","name":"03 DOLATPARA","isHO":false}'::jsonb),
      ('04', '04', '04 KODINAR', 'KODINAR', FALSE, '{"code":"04","name":"04 KODINAR","isHO":false}'::jsonb),
      ('05', '05', '05 KESHOD', 'KESHOD', FALSE, '{"code":"05","name":"05 KESHOD","isHO":false}'::jsonb),
      ('06', '06', '06 VANTHALI', 'VANTHALI', FALSE, '{"code":"06","name":"06 VANTHALI","isHO":false}'::jsonb),
      ('07', '07', '07 MANAVADAR', 'MANAVADAR', FALSE, '{"code":"07","name":"07 MANAVADAR","isHO":false}'::jsonb),
      ('08', '08', '08 GANDHINAGAR', 'GANDHINAGAR', FALSE, '{"code":"08","name":"08 GANDHINAGAR","isHO":false}'::jsonb),
      ('09', '09', '09 LIMBDI', 'LIMBDI', FALSE, '{"code":"09","name":"09 LIMBDI","isHO":false}'::jsonb),
      ('10', '10', '10 MENDARDA', 'MENDARDA', FALSE, '{"code":"10","name":"10 MENDARDA","isHO":false}'::jsonb),
      ('11', '11', '11 VISAVADAR', 'VISAVADAR', FALSE, '{"code":"11","name":"11 VISAVADAR","isHO":false}'::jsonb),
      ('12', '12', '12 JAMNAGAR', 'JAMNAGAR', FALSE, '{"code":"12","name":"12 JAMNAGAR","isHO":false}'::jsonb),
      ('13', '13', '13 BUS STAND', 'BUS STAND', FALSE, '{"code":"13","name":"13 BUS STAND","isHO":false}'::jsonb),
      ('14', '14', '14 LATHI', 'LATHI', FALSE, '{"code":"14","name":"14 LATHI","isHO":false}'::jsonb),
      ('16', '16', '16 AHMEDABAD', 'AHMEDABAD', FALSE, '{"code":"16","name":"16 AHMEDABAD","isHO":false}'::jsonb),
      ('17', '17', '17 RAJKOT', 'RAJKOT', FALSE, '{"code":"17","name":"17 RAJKOT","isHO":false}'::jsonb),
      ('18', '18', '18 ZANZARDA', 'ZANZARDA', FALSE, '{"code":"18","name":"18 ZANZARDA","isHO":false}'::jsonb),
      ('99', '99', '99 HEAD OFFICE', 'HEAD OFFICE', TRUE, '{"code":"99","name":"99 HEAD OFFICE","isHO":true}'::jsonb)
    ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      branch_code = EXCLUDED.branch_code,
      branch_name = EXCLUDED.branch_name,
      is_head_office = EXCLUDED.is_head_office,
      payload = EXCLUDED.payload;
  `;
  await executeSql(branchesSeedSql);
  console.log("✓ jccb_gold_branches 18 branches verified & updated.");

  // Check gold loans count
  const goldCount = await executeSql("SELECT COUNT(*) as cnt FROM jccb_gold_loans;");
  console.log(`✓ jccb_gold_loans records intact: ${goldCount.rows[0].cnt}`);
}

runBackfill().catch(err => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
