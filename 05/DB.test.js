import DB from "./DB";

let db;

beforeEach(() => {
  db = new DB();
});
describe("DB class", () => {
  describe("insert", () => {
    it("inserts data correctly", async () => {
      const data = { id: 1, name: "John" };
      const result = await db.insert(data);
      await db.select(result.id);
      expect(result.id).toBe(1);
      expect(result.name).toBe("John");
    });
    it("show error when id is not a number", async () => {
      try {
        await db.insert({ id: "xyx" });
      } catch (e) {
        expect(e).toBe("ID can be only number!");
      }
    });
    it("show error when id is duplicated", async () => {
      expect.assertions(1);
      await db.insert({ id: 1, name: "John" });

      try {
        await db.insert({ id: 1, name: "Kevin" });
      } catch (e) {
        expect(e).toBe("ID can't be duplicated!");
      }
    });
    it("insert data to DB and generates id if not provided", async () => {
      const data = { name: "Joe" };
      const result = await db.insert(data);
      expect(result).toHaveProperty("id");
      expect(result.name).toEqual(data.name);
    });
  });
  describe("select", () => {
    it("select data by id", async () => {
      const result = await db.insert({ id: 1, name: "John" });
      const selectData = await db.select(1);
      expect(selectData).toEqual(result);
    });
    it("show error when id not exist", async () => {
      expect.assertions(1);
      const id = 123;
      try {
        await db.select(id);
      } catch (e) {
        expect(e).toBe("ID not found");
      }
    });
  });
  describe("remove", () => {
    it("reject to remove not existing id", async () => {
      expect.assertions(1);
      const id = 123;
      try {
        await db.remove(id);
      } catch (e) {
        expect(e).toBe("Item not exist!");
      }
    });
    it("remove item from db when id exist", async () => {
      const data = { name: "Joe", id: 1 };
      await db.insert(data);
      await db.remove(1);
    });
  });
  describe("update", () => {
    it("reject update data without id", async () => {
      expect.assertions(1);
      const data = { name: "John" };
      try {
        await db.update(data);
      } catch (e) {
        expect(e).toBe("ID have to be set!");
      }
    });
    it("update data when id exist", async () => {
      await db.insert({name: 'John'})

      const updatedData = { id: 1, name: 'John' };
      const result = await db.update(updatedData);
      expect(result.name).toBe('John');
    });
  });
 
   it("clears all rows in the database", async () => {
      await db.insert({ id: 1, name: "John" });
      await db.insert({ id: 2, name: "Joe" });
      await db.truncate();
      const rows = await db.getRows();
      expect(rows.length).toBe(0);
     });

   it('get all rows in the database', async () => {
      await db.insert({ id: 1, name: "John" });
      await db.insert({ id: 2, name: "Joe" });
      const rows = await db.getRows()

      expect(rows.length).toBe(2)
   })

});
