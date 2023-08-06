import { isExistFile, writeFile } from "util/file.ts";

type NonQuotableValue = number | boolean | null;

type Inserts<T> = Array<Partial<T>>;

const isNonQuotable = (
  value: NonQuotableValue | string,
): value is NonQuotableValue =>
  typeof value === "number" || typeof value === "boolean" || value === null ||
  value === "";

// 値をシングルクォートで囲む関数
const insertSingleQuote = (
  value: string | NonQuotableValue | undefined,
): string => {
  if (value === undefined) return "NULL"
  else if (isNonQuotable(value)) return String(value)
  else return `'${value}'` 
}

const getInserts = <T extends Record<string, string | number | boolean | null>>(
  inserts: Inserts<T>,
): string => {
  const keys = Object.keys(inserts[0]);
  const values = inserts.map((insert) => {
    return `(${
      keys.map((key) => {
        const value = insert[key];
        if (value === null || value === "") return "NULL"
        else if (typeof value === "string") return insertSingleQuote(value)
        else return String(value);
      }).join(", ")
    })`;
  });
  return `(${keys.join(", ")}) VALUES ${values.join(", ")}`;
};

export const generateInsertSql = (
  table: string,
  inserts: Inserts<Record<string, string | number | boolean | null>>,
): string => {
  if (!inserts) return "";
  return `INSERT INTO ${table}${getInserts(inserts)}`;
};

const getSqlFileName = (table: string) => `sql/insert_data_${table}.sql`;

// SQLで全文取得してINSERT INTO文に整形して.sqlにして保存
export const writeInsertSqlFile = async (
  table: string,
  sql: string,
) => {
  if (await isExistFile(getSqlFileName(table))) {
    await Deno.truncate(getSqlFileName(table));
  }
  await writeFile(`${sql};`, getSqlFileName(table));
  console.log(`create insert data: ${table}`);
};
