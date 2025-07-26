create table Users (
    id serial not null primary key,
    nickname varchar(12) unique not null,
    profile_img varchar not null default 'https://pwf-profile-img.s3.ap-northeast-2.amazonaws.com/user-image-icon-16.jpg',
    email varchar unique not null,
    password varchar(255) not null,
    create_at timestamp default now() not null,
    img_key varchar default null,
    admin default 'user' not null,

    constraint admin_role check (admin in ('user', 'admin'))
)

create table requestFriend(
    res_nickname varchar(12) REFERENCES users (nickname) on delete cascade on update cascade not null, 
    req_nickname varchar(12) REFERENCES users (nickname) on delete cascade on update cascade not null,
    state boolean not null,

    unique(res_nickname, req_nickname) 
)

create table StreamingRoom (
    id serial not null primary key,
    room_name varchar(20) not null,
    participants  integer[] not null,
    create_at timestamp default now() not null
)

-- grant
grant all on (table_name) to pwf_user
grant usage, select, update on sequence (users_id_seq) to pwf_user

