--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrativos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrativos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    puesto character varying(100)
);


ALTER TABLE public.administrativos OWNER TO postgres;

--
-- Name: administrativos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrativos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administrativos_id_seq OWNER TO postgres;

--
-- Name: administrativos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrativos_id_seq OWNED BY public.administrativos.id;


--
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id integer NOT NULL,
    ncontrol character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    grupo character varying(10),
    carrera character varying(100),
    carrera_id integer
);


ALTER TABLE public.alumnos OWNER TO postgres;

--
-- Name: alumnos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumnos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.alumnos_id_seq OWNER TO postgres;

--
-- Name: alumnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumnos_id_seq OWNED BY public.alumnos.id;


--
-- Name: aspirantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aspirantes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    carrera_deseada character varying(100),
    promedio_previo numeric(3,1),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    carrera_id integer
);


ALTER TABLE public.aspirantes OWNER TO postgres;

--
-- Name: aspirantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aspirantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aspirantes_id_seq OWNER TO postgres;

--
-- Name: aspirantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aspirantes_id_seq OWNED BY public.aspirantes.id;


--
-- Name: calificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calificaciones (
    id integer NOT NULL,
    alumno_id integer NOT NULL,
    materia_id integer NOT NULL,
    maestro_id integer,
    periodo character varying(50),
    calificacion numeric(4,2)
);


ALTER TABLE public.calificaciones OWNER TO postgres;

--
-- Name: calificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calificaciones_id_seq OWNER TO postgres;

--
-- Name: calificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calificaciones_id_seq OWNED BY public.calificaciones.id;


--
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.carreras OWNER TO postgres;

--
-- Name: carreras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carreras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carreras_id_seq OWNER TO postgres;

--
-- Name: carreras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carreras_id_seq OWNED BY public.carreras.id;


--
-- Name: maestros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maestros (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    especialidad character varying(100)
);


ALTER TABLE public.maestros OWNER TO postgres;

--
-- Name: maestros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maestros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maestros_id_seq OWNER TO postgres;

--
-- Name: maestros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maestros_id_seq OWNED BY public.maestros.id;


--
-- Name: materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    creditos integer,
    carrera_id integer,
    codigo character varying(20)
);


ALTER TABLE public.materias OWNER TO postgres;

--
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.materias_id_seq OWNER TO postgres;

--
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- Name: administrativos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrativos ALTER COLUMN id SET DEFAULT nextval('public.administrativos_id_seq'::regclass);


--
-- Name: alumnos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos ALTER COLUMN id SET DEFAULT nextval('public.alumnos_id_seq'::regclass);


--
-- Name: aspirantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aspirantes ALTER COLUMN id SET DEFAULT nextval('public.aspirantes_id_seq'::regclass);


--
-- Name: calificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones ALTER COLUMN id SET DEFAULT nextval('public.calificaciones_id_seq'::regclass);


--
-- Name: carreras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN id SET DEFAULT nextval('public.carreras_id_seq'::regclass);


--
-- Name: maestros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros ALTER COLUMN id SET DEFAULT nextval('public.maestros_id_seq'::regclass);


--
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- Data for Name: administrativos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrativos (id, nombre, puesto) FROM stdin;
\.


--
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id, ncontrol, nombre, grupo, carrera, carrera_id) FROM stdin;
\.


--
-- Data for Name: aspirantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aspirantes (id, nombre, carrera_deseada, promedio_previo, fecha_registro, carrera_id) FROM stdin;
\.


--
-- Data for Name: calificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calificaciones (id, alumno_id, materia_id, maestro_id, periodo, calificacion) FROM stdin;
\.


--
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carreras (id, nombre) FROM stdin;
\.


--
-- Data for Name: maestros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maestros (id, nombre, especialidad) FROM stdin;
\.


--
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias (id, nombre, creditos, carrera_id, codigo) FROM stdin;
\.


--
-- Name: administrativos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrativos_id_seq', 1, false);


--
-- Name: alumnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumnos_id_seq', 1, false);


--
-- Name: aspirantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aspirantes_id_seq', 1, false);


--
-- Name: calificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calificaciones_id_seq', 1, false);


--
-- Name: carreras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carreras_id_seq', 1, false);


--
-- Name: maestros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maestros_id_seq', 1, false);


--
-- Name: materias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_id_seq', 1, false);


--
-- Name: administrativos administrativos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrativos
    ADD CONSTRAINT administrativos_pkey PRIMARY KEY (id);


--
-- Name: alumnos alumnos_ncontrol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_ncontrol_key UNIQUE (ncontrol);


--
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id);


--
-- Name: aspirantes aspirantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aspirantes
    ADD CONSTRAINT aspirantes_pkey PRIMARY KEY (id);


--
-- Name: calificaciones calificaciones_alumno_id_materia_id_periodo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_alumno_id_materia_id_periodo_key UNIQUE (alumno_id, materia_id, periodo);


--
-- Name: calificaciones calificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_pkey PRIMARY KEY (id);


--
-- Name: carreras carreras_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_nombre_key UNIQUE (nombre);


--
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id);


--
-- Name: maestros maestros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros
    ADD CONSTRAINT maestros_pkey PRIMARY KEY (id);


--
-- Name: materias materias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_codigo_key UNIQUE (codigo);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: calificaciones calificaciones_alumno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- Name: calificaciones calificaciones_maestro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_maestro_id_fkey FOREIGN KEY (maestro_id) REFERENCES public.maestros(id) ON DELETE SET NULL;


--
-- Name: calificaciones calificaciones_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: alumnos fk_alumnos_carreras; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT fk_alumnos_carreras FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE SET NULL;


--
-- Name: aspirantes fk_aspirantes_carreras; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aspirantes
    ADD CONSTRAINT fk_aspirantes_carreras FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE SET NULL;


--
-- Name: materias fk_materias_carreras; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT fk_materias_carreras FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

