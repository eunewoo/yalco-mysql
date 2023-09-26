import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://yalco-mysql-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

const sql = {
  getSections: async () => {
    const snapshot = await get(ref(db, "sections"));
    return snapshot.val();
  },

  getBusinessesJoined: async (query) => {
    // Note: Firebase doesn't support JOIN operations.
    // You'll have to refactor your data or make multiple queries.
    // Below is just a sample.
    const sectionsSnapshot = await get(ref(db, "sections"));
    const businessesSnapshot = await get(ref(db, "businesses"));
    // Logic to join and filter the two datasets...
    return []; // Return the joined dataset
  },

  getSingleBusinessJoined: async (business_id) => {
    const snapshot = await get(ref(db, "businesses/" + business_id));
    return snapshot.val();
  },

  getMenusOfBusiness: async (business_id) => {
    const snapshot = await get(ref(db, "menus/" + business_id));
    return snapshot.val();
  },

  getRatingsOfBusiness: async (business_id) => {
    const snapshot = await get(ref(db, "ratings/" + business_id));
    return snapshot.val();
  },

  updateMenuLikes: async (id, like) => {
    const snapshot = await get(ref(db, "menus/" + id));
    const currentLikes = snapshot.val().likes || 0;
    await update(ref(db, "menus/" + id), {
      likes: currentLikes + like,
    });
  },

  addRating: async (business_id, stars, comment) => {
    await set(ref(db, "ratings"), {
      fk_business_id: business_id,
      stars: stars,
      comment: comment,
    });
  },

  removeRating: async (rating_id) => {
    await remove(ref(db, "ratings/" + rating_id));
  },
};

export default sql;

// const mysql = require("mysql2");

// const pool = mysql.createPool(
//   process.env.JAWSDB_URL ?? {
//     host: "localhost",
//     user: "root",
//     database: "mydatabase",
//     password: "123456789",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   }
// );
// const promisePool = pool.promise();

// const sql = {
//   getSections: async () => {
//     const [rows] = await promisePool.query(`
//       SELECT * FROM sections
//     `);
//     return rows;
//   },

//   getBusinessesJoined: async (query) => {
//     const sqlQuery = `
//       SELECT * FROM sections S
//       LEFT JOIN businesses B
//         ON S.section_id = B.fk_section_id
//       WHERE TRUE
//         ${query.section ? "AND section_id = " + query.section : ""}
//         ${query.floor ? "AND floor = " + query.floor : ""}
//         ${query.status ? "AND status = '" + query.status + "'" : ""}
//       ORDER BY
//          ${query.order ? query.order : "business_id"}
//     `;
//     console.log(sqlQuery);

//     const [rows] = await promisePool.query(sqlQuery);
//     return rows;
//   },

//   getSingleBusinessJoined: async (business_id) => {
//     const [rows] = await promisePool.query(`
//       SELECT * FROM sections S
//       LEFT JOIN businesses B
//         ON S.section_id = B.fk_section_id
//       WHERE business_id = ${business_id}
//     `);
//     return rows[0];
//   },

//   getMenusOfBusiness: async (business_id) => {
//     const [rows] = await promisePool.query(`
//       SELECT * FROM menus
//       WHERE fk_business_id = ${business_id}
//     `);
//     return rows;
//   },

//   getRatingsOfBusiness: async (business_id) => {
//     const [rows] = await promisePool.query(`
//       SELECT rating_id, stars, comment,
//       DATE_FORMAT(
//         created, '%y년 %m월 %d일 %p %h시 %i분 %s초'
//       ) AS created_fmt
//       FROM ratings
//       WHERE fk_business_id = ${business_id}
//     `);
//     return rows;
//   },

//   updateMenuLikes: async (id, like) => {
//     return await promisePool.query(`
//       UPDATE menus
//       SET likes = likes + ${like}
//       WHERE menu_id = ${id}
//     `);
//   },

//   addRating: async (business_id, stars, comment) => {
//     return await promisePool.query(`
//       INSERT INTO ratings
//       (fk_business_id, stars, comment)
//       VALUES
//       (${business_id}, '${stars}', '${comment}')
//     `);
//   },

//   removeRating: async (rating_id) => {
//     return await promisePool.query(`
//       DELETE FROM ratings
//       WHERE rating_id = ${rating_id}
//     `);
//   },
// };

// module.exports = sql;
