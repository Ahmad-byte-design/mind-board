GET
/api/v1/pages
{
  "data": [
    {
      "id": 2,
      "title": "React Mastery 2",
      "created_at": "2026-08-27T10:47:30.000000Z",
      "updated_at": "2026-08-27T10:47:30.000000Z"
    },
    {
      "id": 1,
      "title": "React Mastery",
      "created_at": "2026-08-27T10:47:20.000000Z",
      "updated_at": "2026-08-27T10:47:20.000000Z"
    }
  ],
  "meta": {
    "per_page": 15,
    "next_cursor": null,
    "prev_cursor": null
  }
}



POST
/api/v1/pages
{
  "title": "React Mastery 2"
}
{
  "message": "Page created successfully.",
  "page": {
    "id": 2,
    "title": "React Mastery 2",
    "created_at": "2026-08-27T10:47:30.000000Z",
    "updated_at": "2026-08-27T10:47:30.000000Z"
  }
}



GET
/api/v1/pages/{page}
{
  "page": {
    "id": 1,
    "title": "React Mastery",
    "created_at": "2026-08-27T10:47:20.000000Z",
    "updated_at": "2026-08-27T10:47:20.000000Z"
  }
}

PUT
/api/v1/pages/{page}
{
  "title": "React Deep Dive"
}{
  "message": "Page updated successfully.",
  "page": {
    "id": 1,
    "title": "React Deep Dive",
    "created_at": "2026-08-27T10:47:20.000000Z",
    "updated_at": "2026-08-27T10:48:01.000000Z"
  }
}

DELETE
/api/v1/pages/{page}

{
  "message": "Page deleted successfully."
}