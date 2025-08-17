"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPlay = dbPlay;
const db_config_1 = require("../config/db.config");
db_config_1.pgClient.connect();
async function dbPlay(query, info) {
    try {
        let data = await db_config_1.pgClient.query(query, info);
        return data.rows;
    }
    catch (err) {
        throw err;
    }
}
