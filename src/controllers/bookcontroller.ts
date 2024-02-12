import pool from '../config/db';

export async function getTopSellingBooks(): Promise<any> {
  try {
    const query = `
      SELECT b.book_id, b.title, SUM(od.quantity_ordered) AS total_sales
      FROM books b
      JOIN order_details od ON b.book_id = od.book_id
      GROUP BY b.book_id, b.title
      ORDER BY total_sales DESC
      LIMIT 10;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Error retrieving top-selling books: ${error}`);
  }
}

export async function calculateTotalRevenue(startDate: string, endDate: string): Promise<number> {
  try {
    const query = `
      SELECT COALESCE(SUM(od.total_price), 0.00) AS total_revenue
      FROM orders o
      JOIN order_details od ON o.order_id = od.order_id
      WHERE o.order_date >= $1 AND o.order_date <= $2;
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return parseFloat(result.rows[0].total_revenue);
  } catch (error) {
    throw new Error(`Error calculating total revenue: ${error}`);
  }
}
