/*
  # Healthcare Application Schema

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - role (text)
      - full_name (text)
      - avatar_url (text)
      - phone (text)
      - specialization (text, for doctors)
      - hospital_id (uuid, for doctors)
    
    - hospitals
      - id (uuid)
      - name (text)
      - address (text)
      - city (text)
      - state (text)
      - phone (text)
      - email (text)
    
    - slots
      - id (uuid)
      - doctor_id (uuid)
      - date (date)
      - start_time (time)
      - end_time (time)
      - is_available (boolean)
    
    - appointments
      - id (uuid)
      - patient_id (uuid)
      - doctor_id (uuid)
      - slot_id (uuid)
      - status (text)
      - type (text)
      - meeting_url (text)
    
    - notifications
      - id (uuid)
      - user_id (uuid)
      - title (text)
      - message (text)
      - read (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
*/

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  specialization text,
  hospital_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES public.profiles(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.profiles(id),
  doctor_id uuid REFERENCES public.profiles(id),
  slot_id uuid REFERENCES public.slots(id),
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  type text NOT NULL CHECK (type IN ('video', 'in-person')),
  meeting_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policies for hospitals
CREATE POLICY "Hospitals are viewable by everyone"
  ON public.hospitals
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify hospitals"
  ON public.hospitals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for slots
CREATE POLICY "Slots are viewable by everyone"
  ON public.slots
  FOR SELECT
  USING (true);

CREATE POLICY "Doctors can manage their slots"
  ON public.slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'doctor'
      AND id = doctor_id
    )
  );

-- Policies for appointments
CREATE POLICY "Users can view their appointments"
  ON public.appointments
  FOR SELECT
  USING (
    auth.uid() = patient_id
    OR auth.uid() = doctor_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (
    auth.uid() = patient_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'patient'
    )
  );

-- Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notification status"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    new.id,
    'patient',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();