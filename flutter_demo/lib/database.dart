import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DbRecord {
  final int id;
  final String name;
  final num number;

  const DbRecord({
    required this.id,
    required this.name,
    required this.number
  });
}

class DatabasePage extends StatefulWidget {
  const DatabasePage({super.key});

  @override
  State<DatabasePage> createState() => _DatabaseState();
}

class _DatabaseState extends State<DatabasePage> {
  List<DbRecord> _records = [];

  Future<void> _loadData() async {
    var dbPath = join(await getDatabasesPath(), 'test.db');
    var db = await openDatabase(dbPath);

    await db.execute('DROP TABLE IF EXISTS Test');
    await db.execute('CREATE TABLE Test (id INTEGER PRIMARY KEY, name TEXT, value INTEGER, number REAL)');
    // Insert some records in a transaction
    await db.transaction((txn) async {
      await txn.rawInsert(
          'INSERT INTO Test(name, value, number) VALUES("some name", 1234, 456.789)');
      await txn.rawInsert(
          'INSERT INTO Test(name, value, number) VALUES(?, ?, ?)',
          ['another name', 12345678, 3.1416]);
    });

    final results = await(db.query('test'));
    final records = [
      for (final {
        'id': id as int,
        'name': name as String,
        'number': number as num
      } in results)
      DbRecord(id: id, name: name, number: number),
    ];
    setState(() {
      _records = records;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Table(
            children: _records.isEmpty ? [] : <TableRow>[
              const TableRow(children: [
                TableCell(child: Text('ID')),
                TableCell(child: Text('Name')),
                TableCell(child: Text('Value')),
              ]),
              ..._records.map((record) =>
                TableRow(children: [
                  TableCell(child: Text(record.id.toString())),
                  TableCell(child: Text(record.name)),
                  TableCell(child: Text(record.number.toString())),
                ])
              )
            ],
          ),
          TextButton(
            onPressed: _loadData,
            child: Text('Load Data'),
          ),
        ],
      ),
    );
  }
}
