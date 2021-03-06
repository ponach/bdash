import assert from "assert";
import initialize from "../../fixtures/mysql/initialize";
import Mysql from "../../../src/lib/DataSourceDefinition/Mysql";
import DataSourceConfig from "../../helpers/DataSourceConfig";

suite("DataSourceDefinition/Mysql", () => {
  const config = DataSourceConfig.mysql;

  suiteSetup(async () => {
    await initialize();
  });

  test("execute", async () => {
    const result = await new Mysql(config).execute("select id, text from test order by id");
    assert.deepStrictEqual(result, {
      fields: ["id", "text"],
      rows: [[1, "foo"], [2, "bar"], [3, "baz"]]
    });
  });

  test("cancel", async () => {
    const connection = new Mysql(config);
    const timer = setTimeout(() => assert.fail("can not cancel"), 2000);
    setTimeout(() => connection.cancel(), 500);

    try {
      await connection.execute("select sleep(5)");
      clearTimeout(timer);
    } catch (err) {
      assert.fail(err);
    }
  });

  test("connectionTest successful", async () => {
    await new Mysql(config).connectionTest();
  });

  test("connectionTest failed", async () => {
    try {
      await new Mysql({ host: "x" }).connectionTest();
      assert.fail("connectionTest does not fail");
    } catch (err) {
      assert.ok(/getaddrinfo ENOTFOUND/.test(err.message));
    }
  });
});
