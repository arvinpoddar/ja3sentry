--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 15.1

-- Started on 2023-04-14 13:54:21 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: ja3sentry
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO ja3sentry;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16409)
-- Name: potential; Type: TABLE; Schema: public; Owner: ja3sentry
--

CREATE TABLE public.potential (
    ja3 character varying(256),
    ja3_md5 character varying(256),
    ja3_sha1 character varying(256),
    user_agent character varying(256),
    collected_at character varying(256)
);


ALTER TABLE public.potential OWNER TO ja3sentry;

--
-- TOC entry 209 (class 1259 OID 16402)
-- Name: threats; Type: TABLE; Schema: public; Owner: ja3sentry
--

CREATE TABLE public.threats (
    ja3 character varying(256),
    ja3_md5 character varying(256),
    ja3_sha1 character varying(256),
    first_seen character varying(256),
    last_seen character varying(256),
    reason character varying(256),
    source character varying(256),
    user_agent character varying(256)
);


ALTER TABLE public.threats OWNER TO ja3sentry;

--
-- TOC entry 4274 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ja3sentry
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2023-04-14 13:54:23 EDT

--
-- PostgreSQL database dump complete
--

