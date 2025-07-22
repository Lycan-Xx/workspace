/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "name": ""
      }
    }
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2434144904",
    "max": 0,
    "min": 0,
    "name": "lastName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1146066909",
    "max": 0,
    "min": 0,
    "name": "phone",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select561821875",
    "maxSelect": 1,
    "name": "accountType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "personal",
      "business"
    ]
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "select614373258",
    "maxSelect": 1,
    "name": "tier",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "tier1",
      "tier2",
      "tier3"
    ]
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number2901680126",
    "max": null,
    "min": null,
    "name": "balance",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2251811895",
    "max": 0,
    "min": 0,
    "name": "securityPin",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "bool2487745274",
    "name": "isVerified",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "date684678118",
    "max": "",
    "min": "",
    "name": "lastLoginTime",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 255,
    "min": 0,
    "name": "firstName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "name": "name"
      }
    }
  }, collection)

  // remove field
  collection.fields.removeById("text2434144904")

  // remove field
  collection.fields.removeById("text1146066909")

  // remove field
  collection.fields.removeById("select561821875")

  // remove field
  collection.fields.removeById("select614373258")

  // remove field
  collection.fields.removeById("number2901680126")

  // remove field
  collection.fields.removeById("text2251811895")

  // remove field
  collection.fields.removeById("bool2487745274")

  // remove field
  collection.fields.removeById("date684678118")

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 255,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
