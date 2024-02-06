const util = require("util");

module.exports = (db, dbTable) => {
  const query = util.promisify(db.query).bind(db);

  const executeQuery = async (query, callback) => {
    try {
      const results = await query();
      const res = { statut: true, error: false, results: results };

      if (callback && typeof callback === "function") {
        callback(res);
      }

      return res;
    } catch (err) {
      await db.rollback();
      const res = { statut: false, error: err, results: null };

      if (callback && typeof callback === "function") {
        callback(res);
      }

      return res;
    }
  };

  const get = async (
    fields = "*",
    callback = false,
    table = dbTable,
    where = ""
  ) => {
    const queryFunc = () => query(`SELECT ${fields} FROM ${table} ${where}`);
    return executeQuery(queryFunc, callback);
  };

  const post = async (fields, callback = false, table = dbTable) => {
    const queryFunc = () => query(`INSERT INTO ${table} SET ?`, fields);
    return executeQuery(queryFunc, callback);
  };

  const searchEntry = async (
    fields = "*",
    callback = false,
    searchKey = "id",
    table = dbTable
  ) => {
    const searchValue = 46;
    const queryFunc = () =>
      query(`SELECT * FROM users WHERE ${searchKey} = "${searchValue}"`);
    return executeQuery(queryFunc, callback);
  };

  const putEntry = async (
    searchValue,
    fields,
    callback = false,
    searchKey = "id",
    table = dbTable
  ) => {
    const queryFunc = () =>
      query(
        `UPDATE ${table} SET ? WHERE ${searchKey} = "${searchValue}"`,
        fields
      );
    return executeQuery(queryFunc, callback);
  };

  const deleteEntry = async (
    searchValue,
    callback = false,
    searchKey = "id",
    table = dbTable
  ) => {
    const queryFunc = () =>
      query(`DELETE FROM ${table} WHERE ${searchKey} = "${searchValue}"`);
    return executeQuery(queryFunc, callback);
  };

  return { get, searchEntry, post, putEntry, deleteEntry };
};
