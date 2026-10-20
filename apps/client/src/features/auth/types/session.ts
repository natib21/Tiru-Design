export type SessionUser = {
  id: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type Session = {
  user: SessionUser;
};

export type SessionResponse = {
  user: SessionUser | null;
};
