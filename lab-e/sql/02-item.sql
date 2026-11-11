create table item
(
    id          integer not null
        constraint item_pk
            primary key autoincrement,
    name        text not null,
    description text not null
);
