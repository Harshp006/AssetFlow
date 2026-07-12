--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2026-07-12 12:01:18 IST

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
-- TOC entry 245 (class 1259 OID 16851)
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    log_id integer NOT NULL,
    actor_employee_id integer,
    action_type character varying(50),
    entity_type character varying(50),
    entity_id integer,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16850)
-- Name: activity_logs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_logs_log_id_seq OWNER TO postgres;

--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 244
-- Name: activity_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_log_id_seq OWNED BY public.activity_logs.log_id;


--
-- TOC entry 227 (class 1259 OID 16593)
-- Name: asset_allocation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_allocation_requests (
    request_id integer NOT NULL,
    asset_id integer,
    requested_by_employee_id integer,
    target_employee_id integer,
    target_department_id integer,
    expected_return_date date,
    dept_head_by integer,
    dept_head_status character varying(20),
    asset_manager_by integer,
    asset_manager_status character varying(20),
    overall_status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_allocation_requests OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16592)
-- Name: asset_allocation_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_allocation_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asset_allocation_requests_request_id_seq OWNER TO postgres;

--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 226
-- Name: asset_allocation_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_allocation_requests_request_id_seq OWNED BY public.asset_allocation_requests.request_id;


--
-- TOC entry 229 (class 1259 OID 16631)
-- Name: asset_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_allocations (
    allocation_id integer NOT NULL,
    allocation_request_id integer,
    asset_id integer,
    employee_id integer,
    department_id integer,
    allocated_by integer,
    allocation_date date,
    expected_return_date date,
    actual_return_date date,
    return_condition_notes text,
    returned_by integer,
    status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_allocations OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16630)
-- Name: asset_allocations_allocation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_allocations_allocation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asset_allocations_allocation_id_seq OWNER TO postgres;

--
-- TOC entry 3913 (class 0 OID 0)
-- Dependencies: 228
-- Name: asset_allocations_allocation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_allocations_allocation_id_seq OWNED BY public.asset_allocations.allocation_id;


--
-- TOC entry 221 (class 1259 OID 16552)
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    default_warranty_months integer
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16551)
-- Name: asset_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asset_categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 3914 (class 0 OID 0)
-- Dependencies: 220
-- Name: asset_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_categories_category_id_seq OWNED BY public.asset_categories.category_id;


--
-- TOC entry 231 (class 1259 OID 16671)
-- Name: asset_transfer_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_transfer_requests (
    transfer_id integer NOT NULL,
    asset_id integer,
    current_allocation_id integer,
    requested_by integer,
    to_employee_id integer,
    from_department_id integer,
    to_department_id integer,
    reason text,
    dept_head_status character varying(20),
    asset_manager_status character varying(20),
    overall_status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    decided_at timestamp without time zone
);


ALTER TABLE public.asset_transfer_requests OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16670)
-- Name: asset_transfer_requests_transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_transfer_requests_transfer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asset_transfer_requests_transfer_id_seq OWNER TO postgres;

--
-- TOC entry 3915 (class 0 OID 0)
-- Dependencies: 230
-- Name: asset_transfer_requests_transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_transfer_requests_transfer_id_seq OWNED BY public.asset_transfer_requests.transfer_id;


--
-- TOC entry 225 (class 1259 OID 16570)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    asset_id integer NOT NULL,
    asset_tag character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    category_id integer,
    serial_number character varying(100),
    acquisition_date date,
    acquisition_cost numeric(10,2),
    condition character varying(50),
    location_id integer,
    current_status character varying(50),
    is_bookable boolean DEFAULT false,
    photo_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16569)
-- Name: assets_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assets_asset_id_seq OWNER TO postgres;

--
-- TOC entry 3916 (class 0 OID 0)
-- Dependencies: 224
-- Name: assets_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_asset_id_seq OWNED BY public.assets.asset_id;


--
-- TOC entry 239 (class 1259 OID 16783)
-- Name: audit_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_assignments (
    assignment_id integer NOT NULL,
    audit_id integer,
    auditor_employee_id integer,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_assignments OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16782)
-- Name: audit_assignments_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_assignments_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 3917 (class 0 OID 0)
-- Dependencies: 238
-- Name: audit_assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_assignments_assignment_id_seq OWNED BY public.audit_assignments.assignment_id;


--
-- TOC entry 237 (class 1259 OID 16760)
-- Name: audit_cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_cycles (
    audit_id integer NOT NULL,
    name character varying(150) NOT NULL,
    scope_department_id integer,
    scope_location_id integer,
    start_date date,
    end_date date,
    status character varying(20),
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    closed_at timestamp without time zone
);


ALTER TABLE public.audit_cycles OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16759)
-- Name: audit_cycles_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_cycles_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_cycles_audit_id_seq OWNER TO postgres;

--
-- TOC entry 3918 (class 0 OID 0)
-- Dependencies: 236
-- Name: audit_cycles_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_cycles_audit_id_seq OWNED BY public.audit_cycles.audit_id;


--
-- TOC entry 241 (class 1259 OID 16801)
-- Name: audit_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_results (
    result_id integer NOT NULL,
    audit_id integer,
    asset_id integer,
    auditor_employee_id integer,
    expected_location_id integer,
    verification_status character varying(20),
    remarks text,
    verified_at timestamp without time zone,
    resolution_status character varying(20),
    resolved_by integer,
    resolved_at timestamp without time zone,
    resolution_notes text
);


ALTER TABLE public.audit_results OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16800)
-- Name: audit_results_result_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_results_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_results_result_id_seq OWNER TO postgres;

--
-- TOC entry 3919 (class 0 OID 0)
-- Dependencies: 240
-- Name: audit_results_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_results_result_id_seq OWNED BY public.audit_results.result_id;


--
-- TOC entry 217 (class 1259 OID 16511)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id integer NOT NULL,
    name character varying(100) NOT NULL,
    parent_department_id integer,
    head_employee_id integer,
    status character varying(20) DEFAULT 'Active'::character varying
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16510)
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departments_department_id_seq OWNER TO postgres;

--
-- TOC entry 3920 (class 0 OID 0)
-- Dependencies: 216
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- TOC entry 219 (class 1259 OID 16519)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    department_id integer,
    role_id integer,
    status character varying(20) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16518)
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employees_employee_id_seq OWNER TO postgres;

--
-- TOC entry 3921 (class 0 OID 0)
-- Dependencies: 218
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- TOC entry 223 (class 1259 OID 16561)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    location_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address text
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16560)
-- Name: locations_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_location_id_seq OWNER TO postgres;

--
-- TOC entry 3922 (class 0 OID 0)
-- Dependencies: 222
-- Name: locations_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_location_id_seq OWNED BY public.locations.location_id;


--
-- TOC entry 235 (class 1259 OID 16734)
-- Name: maintenance_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_requests (
    maintenance_id integer NOT NULL,
    asset_id integer,
    raised_by_employee_id integer,
    issue_description text,
    priority character varying(20),
    photo_url text,
    status character varying(20),
    approved_by integer,
    approved_at timestamp without time zone,
    technician_name character varying(100),
    technician_assigned_at timestamp without time zone,
    resolved_at timestamp without time zone,
    resolution_notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_requests OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16733)
-- Name: maintenance_requests_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_requests_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maintenance_requests_maintenance_id_seq OWNER TO postgres;

--
-- TOC entry 3923 (class 0 OID 0)
-- Dependencies: 234
-- Name: maintenance_requests_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_requests_maintenance_id_seq OWNED BY public.maintenance_requests.maintenance_id;


--
-- TOC entry 243 (class 1259 OID 16835)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    recipient_employee_id integer,
    type character varying(50),
    message text,
    related_entity_type character varying(50),
    related_entity_id integer,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16834)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 3924 (class 0 OID 0)
-- Dependencies: 242
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 233 (class 1259 OID 16711)
-- Name: resource_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_bookings (
    booking_id integer NOT NULL,
    asset_id integer,
    booked_by_employee_id integer,
    department_id integer,
    start_datetime timestamp without time zone,
    end_datetime timestamp without time zone,
    status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resource_bookings OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16710)
-- Name: resource_bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resource_bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resource_bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 3925 (class 0 OID 0)
-- Dependencies: 232
-- Name: resource_bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resource_bookings_booking_id_seq OWNED BY public.resource_bookings.booking_id;


--
-- TOC entry 215 (class 1259 OID 16502)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16501)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_role_id_seq OWNER TO postgres;

--
-- TOC entry 3926 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- TOC entry 3650 (class 2604 OID 16854)
-- Name: activity_logs log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN log_id SET DEFAULT nextval('public.activity_logs_log_id_seq'::regclass);


--
-- TOC entry 3632 (class 2604 OID 16596)
-- Name: asset_allocation_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests ALTER COLUMN request_id SET DEFAULT nextval('public.asset_allocation_requests_request_id_seq'::regclass);


--
-- TOC entry 3634 (class 2604 OID 16634)
-- Name: asset_allocations allocation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations ALTER COLUMN allocation_id SET DEFAULT nextval('public.asset_allocations_allocation_id_seq'::regclass);


--
-- TOC entry 3627 (class 2604 OID 16555)
-- Name: asset_categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories ALTER COLUMN category_id SET DEFAULT nextval('public.asset_categories_category_id_seq'::regclass);


--
-- TOC entry 3636 (class 2604 OID 16674)
-- Name: asset_transfer_requests transfer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests ALTER COLUMN transfer_id SET DEFAULT nextval('public.asset_transfer_requests_transfer_id_seq'::regclass);


--
-- TOC entry 3629 (class 2604 OID 16573)
-- Name: assets asset_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets ALTER COLUMN asset_id SET DEFAULT nextval('public.assets_asset_id_seq'::regclass);


--
-- TOC entry 3644 (class 2604 OID 16786)
-- Name: audit_assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.audit_assignments_assignment_id_seq'::regclass);


--
-- TOC entry 3642 (class 2604 OID 16763)
-- Name: audit_cycles audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_cycles ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_cycles_audit_id_seq'::regclass);


--
-- TOC entry 3646 (class 2604 OID 16804)
-- Name: audit_results result_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results ALTER COLUMN result_id SET DEFAULT nextval('public.audit_results_result_id_seq'::regclass);


--
-- TOC entry 3622 (class 2604 OID 16514)
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- TOC entry 3624 (class 2604 OID 16522)
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- TOC entry 3628 (class 2604 OID 16564)
-- Name: locations location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN location_id SET DEFAULT nextval('public.locations_location_id_seq'::regclass);


--
-- TOC entry 3640 (class 2604 OID 16737)
-- Name: maintenance_requests maintenance_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests ALTER COLUMN maintenance_id SET DEFAULT nextval('public.maintenance_requests_maintenance_id_seq'::regclass);


--
-- TOC entry 3647 (class 2604 OID 16838)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 3638 (class 2604 OID 16714)
-- Name: resource_bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.resource_bookings_booking_id_seq'::regclass);


--
-- TOC entry 3621 (class 2604 OID 16505)
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- TOC entry 3905 (class 0 OID 16851)
-- Dependencies: 245
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (log_id, actor_employee_id, action_type, entity_type, entity_id, description, created_at) FROM stdin;
\.


--
-- TOC entry 3887 (class 0 OID 16593)
-- Dependencies: 227
-- Data for Name: asset_allocation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_allocation_requests (request_id, asset_id, requested_by_employee_id, target_employee_id, target_department_id, expected_return_date, dept_head_by, dept_head_status, asset_manager_by, asset_manager_status, overall_status, created_at) FROM stdin;
\.


--
-- TOC entry 3889 (class 0 OID 16631)
-- Dependencies: 229
-- Data for Name: asset_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_allocations (allocation_id, allocation_request_id, asset_id, employee_id, department_id, allocated_by, allocation_date, expected_return_date, actual_return_date, return_condition_notes, returned_by, status, created_at) FROM stdin;
\.


--
-- TOC entry 3881 (class 0 OID 16552)
-- Dependencies: 221
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_categories (category_id, name, description, default_warranty_months) FROM stdin;
\.


--
-- TOC entry 3891 (class 0 OID 16671)
-- Dependencies: 231
-- Data for Name: asset_transfer_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_transfer_requests (transfer_id, asset_id, current_allocation_id, requested_by, to_employee_id, from_department_id, to_department_id, reason, dept_head_status, asset_manager_status, overall_status, created_at, decided_at) FROM stdin;
\.


--
-- TOC entry 3885 (class 0 OID 16570)
-- Dependencies: 225
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (asset_id, asset_tag, name, category_id, serial_number, acquisition_date, acquisition_cost, condition, location_id, current_status, is_bookable, photo_url, created_at) FROM stdin;
\.


--
-- TOC entry 3899 (class 0 OID 16783)
-- Dependencies: 239
-- Data for Name: audit_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_assignments (assignment_id, audit_id, auditor_employee_id, assigned_at) FROM stdin;
\.


--
-- TOC entry 3897 (class 0 OID 16760)
-- Dependencies: 237
-- Data for Name: audit_cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_cycles (audit_id, name, scope_department_id, scope_location_id, start_date, end_date, status, created_by, created_at, closed_at) FROM stdin;
\.


--
-- TOC entry 3901 (class 0 OID 16801)
-- Dependencies: 241
-- Data for Name: audit_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_results (result_id, audit_id, asset_id, auditor_employee_id, expected_location_id, verification_status, remarks, verified_at, resolution_status, resolved_by, resolved_at, resolution_notes) FROM stdin;
\.


--
-- TOC entry 3877 (class 0 OID 16511)
-- Dependencies: 217
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (department_id, name, parent_department_id, head_employee_id, status) FROM stdin;
\.


--
-- TOC entry 3879 (class 0 OID 16519)
-- Dependencies: 219
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, full_name, email, password_hash, department_id, role_id, status, created_at) FROM stdin;
\.


--
-- TOC entry 3883 (class 0 OID 16561)
-- Dependencies: 223
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (location_id, name, address) FROM stdin;
\.


--
-- TOC entry 3895 (class 0 OID 16734)
-- Dependencies: 235
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_requests (maintenance_id, asset_id, raised_by_employee_id, issue_description, priority, photo_url, status, approved_by, approved_at, technician_name, technician_assigned_at, resolved_at, resolution_notes, created_at) FROM stdin;
\.


--
-- TOC entry 3903 (class 0 OID 16835)
-- Dependencies: 243
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, recipient_employee_id, type, message, related_entity_type, related_entity_id, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 3893 (class 0 OID 16711)
-- Dependencies: 233
-- Data for Name: resource_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_bookings (booking_id, asset_id, booked_by_employee_id, department_id, start_datetime, end_datetime, status, created_at) FROM stdin;
\.


--
-- TOC entry 3875 (class 0 OID 16502)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name) FROM stdin;
\.


--
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 244
-- Name: activity_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_log_id_seq', 1, false);


--
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 226
-- Name: asset_allocation_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_allocation_requests_request_id_seq', 1, false);


--
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 228
-- Name: asset_allocations_allocation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_allocations_allocation_id_seq', 1, false);


--
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 220
-- Name: asset_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_categories_category_id_seq', 1, false);


--
-- TOC entry 3931 (class 0 OID 0)
-- Dependencies: 230
-- Name: asset_transfer_requests_transfer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_transfer_requests_transfer_id_seq', 1, false);


--
-- TOC entry 3932 (class 0 OID 0)
-- Dependencies: 224
-- Name: assets_asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_asset_id_seq', 1, false);


--
-- TOC entry 3933 (class 0 OID 0)
-- Dependencies: 238
-- Name: audit_assignments_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_assignments_assignment_id_seq', 1, false);


--
-- TOC entry 3934 (class 0 OID 0)
-- Dependencies: 236
-- Name: audit_cycles_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_cycles_audit_id_seq', 1, false);


--
-- TOC entry 3935 (class 0 OID 0)
-- Dependencies: 240
-- Name: audit_results_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_results_result_id_seq', 1, false);


--
-- TOC entry 3936 (class 0 OID 0)
-- Dependencies: 216
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 1, false);


--
-- TOC entry 3937 (class 0 OID 0)
-- Dependencies: 218
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 1, false);


--
-- TOC entry 3938 (class 0 OID 0)
-- Dependencies: 222
-- Name: locations_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_location_id_seq', 1, false);


--
-- TOC entry 3939 (class 0 OID 0)
-- Dependencies: 234
-- Name: maintenance_requests_maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_requests_maintenance_id_seq', 1, false);


--
-- TOC entry 3940 (class 0 OID 0)
-- Dependencies: 242
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- TOC entry 3941 (class 0 OID 0)
-- Dependencies: 232
-- Name: resource_bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_bookings_booking_id_seq', 1, false);


--
-- TOC entry 3942 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- TOC entry 3689 (class 2606 OID 16859)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (log_id);


--
-- TOC entry 3671 (class 2606 OID 16599)
-- Name: asset_allocation_requests asset_allocation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT asset_allocation_requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 3673 (class 2606 OID 16639)
-- Name: asset_allocations asset_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT asset_allocations_pkey PRIMARY KEY (allocation_id);


--
-- TOC entry 3663 (class 2606 OID 16559)
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 3675 (class 2606 OID 16679)
-- Name: asset_transfer_requests asset_transfer_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT asset_transfer_requests_pkey PRIMARY KEY (transfer_id);


--
-- TOC entry 3667 (class 2606 OID 16581)
-- Name: assets assets_asset_tag_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_tag_key UNIQUE (asset_tag);


--
-- TOC entry 3669 (class 2606 OID 16579)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (asset_id);


--
-- TOC entry 3683 (class 2606 OID 16789)
-- Name: audit_assignments audit_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_assignments
    ADD CONSTRAINT audit_assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 3681 (class 2606 OID 16766)
-- Name: audit_cycles audit_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_cycles
    ADD CONSTRAINT audit_cycles_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 3685 (class 2606 OID 16808)
-- Name: audit_results audit_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT audit_results_pkey PRIMARY KEY (result_id);


--
-- TOC entry 3657 (class 2606 OID 16517)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- TOC entry 3659 (class 2606 OID 16530)
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- TOC entry 3661 (class 2606 OID 16528)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 3665 (class 2606 OID 16568)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (location_id);


--
-- TOC entry 3679 (class 2606 OID 16742)
-- Name: maintenance_requests maintenance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_pkey PRIMARY KEY (maintenance_id);


--
-- TOC entry 3687 (class 2606 OID 16844)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 3677 (class 2606 OID 16717)
-- Name: resource_bookings resource_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_bookings
    ADD CONSTRAINT resource_bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 3653 (class 2606 OID 16507)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 3655 (class 2606 OID 16509)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 3731 (class 2606 OID 16860)
-- Name: activity_logs fk_activity_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT fk_activity_employee FOREIGN KEY (actor_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3702 (class 2606 OID 16660)
-- Name: asset_allocations fk_allocated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_allocated_by FOREIGN KEY (allocated_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3703 (class 2606 OID 16645)
-- Name: asset_allocations fk_allocation_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_allocation_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3704 (class 2606 OID 16655)
-- Name: asset_allocations fk_allocation_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_allocation_department FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3705 (class 2606 OID 16650)
-- Name: asset_allocations fk_allocation_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_allocation_employee FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3706 (class 2606 OID 16640)
-- Name: asset_allocations fk_allocation_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_allocation_request FOREIGN KEY (allocation_request_id) REFERENCES public.asset_allocation_requests(request_id);


--
-- TOC entry 3694 (class 2606 OID 16582)
-- Name: assets fk_asset_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES public.asset_categories(category_id);


--
-- TOC entry 3695 (class 2606 OID 16587)
-- Name: assets fk_asset_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES public.locations(location_id);


--
-- TOC entry 3723 (class 2606 OID 16790)
-- Name: audit_assignments fk_assignment_audit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_assignments
    ADD CONSTRAINT fk_assignment_audit FOREIGN KEY (audit_id) REFERENCES public.audit_cycles(audit_id);


--
-- TOC entry 3724 (class 2606 OID 16795)
-- Name: audit_assignments fk_assignment_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_assignments
    ADD CONSTRAINT fk_assignment_employee FOREIGN KEY (auditor_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3720 (class 2606 OID 16777)
-- Name: audit_cycles fk_audit_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_cycles
    ADD CONSTRAINT fk_audit_created_by FOREIGN KEY (created_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3721 (class 2606 OID 16767)
-- Name: audit_cycles fk_audit_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_cycles
    ADD CONSTRAINT fk_audit_department FOREIGN KEY (scope_department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3722 (class 2606 OID 16772)
-- Name: audit_cycles fk_audit_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_cycles
    ADD CONSTRAINT fk_audit_location FOREIGN KEY (scope_location_id) REFERENCES public.locations(location_id);


--
-- TOC entry 3714 (class 2606 OID 16718)
-- Name: resource_bookings fk_booking_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_bookings
    ADD CONSTRAINT fk_booking_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3715 (class 2606 OID 16728)
-- Name: resource_bookings fk_booking_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_bookings
    ADD CONSTRAINT fk_booking_department FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3716 (class 2606 OID 16723)
-- Name: resource_bookings fk_booking_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_bookings
    ADD CONSTRAINT fk_booking_employee FOREIGN KEY (booked_by_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3690 (class 2606 OID 16546)
-- Name: departments fk_department_head; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_department_head FOREIGN KEY (head_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3691 (class 2606 OID 16541)
-- Name: departments fk_department_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3692 (class 2606 OID 16531)
-- Name: employees fk_employee_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3693 (class 2606 OID 16536)
-- Name: employees fk_employee_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT fk_employee_role FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 3717 (class 2606 OID 16754)
-- Name: maintenance_requests fk_maintenance_approved_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT fk_maintenance_approved_by FOREIGN KEY (approved_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3718 (class 2606 OID 16744)
-- Name: maintenance_requests fk_maintenance_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT fk_maintenance_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3719 (class 2606 OID 16749)
-- Name: maintenance_requests fk_maintenance_raised_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT fk_maintenance_raised_by FOREIGN KEY (raised_by_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3730 (class 2606 OID 16845)
-- Name: notifications fk_notification_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_employee FOREIGN KEY (recipient_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3696 (class 2606 OID 16600)
-- Name: asset_allocation_requests fk_request_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3697 (class 2606 OID 16625)
-- Name: asset_allocation_requests fk_request_asset_manager; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_asset_manager FOREIGN KEY (asset_manager_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3698 (class 2606 OID 16620)
-- Name: asset_allocation_requests fk_request_dept_head; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_dept_head FOREIGN KEY (dept_head_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3699 (class 2606 OID 16605)
-- Name: asset_allocation_requests fk_request_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_requested_by FOREIGN KEY (requested_by_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3700 (class 2606 OID 16615)
-- Name: asset_allocation_requests fk_request_target_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_target_department FOREIGN KEY (target_department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3701 (class 2606 OID 16610)
-- Name: asset_allocation_requests fk_request_target_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocation_requests
    ADD CONSTRAINT fk_request_target_employee FOREIGN KEY (target_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3725 (class 2606 OID 16814)
-- Name: audit_results fk_result_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT fk_result_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3726 (class 2606 OID 16809)
-- Name: audit_results fk_result_audit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT fk_result_audit FOREIGN KEY (audit_id) REFERENCES public.audit_cycles(audit_id);


--
-- TOC entry 3727 (class 2606 OID 16819)
-- Name: audit_results fk_result_auditor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT fk_result_auditor FOREIGN KEY (auditor_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3728 (class 2606 OID 16824)
-- Name: audit_results fk_result_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT fk_result_location FOREIGN KEY (expected_location_id) REFERENCES public.locations(location_id);


--
-- TOC entry 3729 (class 2606 OID 16829)
-- Name: audit_results fk_result_resolved_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_results
    ADD CONSTRAINT fk_result_resolved_by FOREIGN KEY (resolved_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3707 (class 2606 OID 16665)
-- Name: asset_allocations fk_returned_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_allocations
    ADD CONSTRAINT fk_returned_by FOREIGN KEY (returned_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3708 (class 2606 OID 16685)
-- Name: asset_transfer_requests fk_transfer_allocation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_allocation FOREIGN KEY (current_allocation_id) REFERENCES public.asset_allocations(allocation_id);


--
-- TOC entry 3709 (class 2606 OID 16680)
-- Name: asset_transfer_requests fk_transfer_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- TOC entry 3710 (class 2606 OID 16695)
-- Name: asset_transfer_requests fk_transfer_employee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_employee FOREIGN KEY (to_employee_id) REFERENCES public.employees(employee_id);


--
-- TOC entry 3711 (class 2606 OID 16700)
-- Name: asset_transfer_requests fk_transfer_from_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_from_department FOREIGN KEY (from_department_id) REFERENCES public.departments(department_id);


--
-- TOC entry 3712 (class 2606 OID 16690)
-- Name: asset_transfer_requests fk_transfer_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_requested_by FOREIGN KEY (requested_by) REFERENCES public.employees(employee_id);


--
-- TOC entry 3713 (class 2606 OID 16705)
-- Name: asset_transfer_requests fk_transfer_to_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfer_requests
    ADD CONSTRAINT fk_transfer_to_department FOREIGN KEY (to_department_id) REFERENCES public.departments(department_id);


-- Completed on 2026-07-12 12:01:18 IST

--
-- PostgreSQL database dump complete
--

