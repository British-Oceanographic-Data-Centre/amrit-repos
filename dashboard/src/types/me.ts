export type Me = {
  id?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  email2?: string | null;
  title?: string | null;
  tel?: string | null;
  tel2?: string | null;
  address?: string | null;
  orcid?: string | null;
  hideContactInfoFromPublic?: boolean | null;

  country?: {
    id: number;
    name: string;
    code2?: string;
    name_short?: string;
  } | null;

  roles?: string[];
};

export type MePatchPayload = Partial<Me> & {
  countryId?: number | null;
};