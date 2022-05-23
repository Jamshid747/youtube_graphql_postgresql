-- initialization (just copy and paste)

-- connect to another db
\c postgres;

-- drop database if exists
drop database if exists youtube;

-- create database youtube
create database youtube;

-- connect to database youtube
\c youtube;

----------------------------------------------------------
-- model

-- extensions
create extension if not exists "uuid-ossp";

-- users table
drop table if exists users;
create table users (
    user_id uuid default uuid_generate_v4() primary key,
    user_name character varying(255) not null,
    user_password character varying(64) not null,
    user_profileImg character varying(64) not null,
    user_created_at timestamp default current_timestamp,
    user_deleted_at timestamp default null
);

-- videos table
drop table if exists videos;
create table videos (
    video_id uuid default uuid_generate_v4() primary key,
    video_name character varying(255) not null,
    video_link text not null,
    user_id uuid not null references users(user_id),
    video_size int not null,
    video_mimetype character varying(30) not null,
    video_created_at timestamp default current_timestamp,
    video_deleted_at timestamp default null
);

