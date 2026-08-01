import { GetProfileResponse, UserStatus, UserProfileRole } from '../../_api';

const firstNames = [
  'James',
  'Mary',
  'Robert',
  'Patricia',
  'John',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'William',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Christopher',
  'Karen',
  'Charles',
  'Lisa',
  'Daniel',
  'Nancy',
  'Matthew',
  'Betty',
  'Anthony',
  'Margaret',
  'Mark',
  'Sandra',
  'Donald',
  'Ashley',
  'Steven',
  'Kimberly',
  'Paul',
  'Emily',
  'Andrew',
  'Donna',
  'Joshua',
  'Michelle',
  'Kenneth',
  'Carol',
  'Kevin',
  'Amanda',
  'Brian',
  'Dorothy',
  'George',
  'Melissa',
  'Timothy',
  'Deborah',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
];

function createMockUser(index: number): GetProfileResponse {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;

  return {
    id: `user-${String(index + 1).padStart(3, '0')}`,
    firstName,
    lastName,
    email,
    phone: `+1-555-${String(1000 + index).slice(-4)}-${String(1000 + index * 7).slice(-4)}`,
    status: UserStatus.Active,
    roles: [
      {
        userRoleId: `role-${index + 1}`,
        role: index === 0 ? UserProfileRole.Admin : UserProfileRole.User,
      },
    ],
    isGuest: false,
    isEmailVerified: true,
  };
}

export const TEST_USER_EMAIL = 'admin@test.com';
export const TEST_USER_PASSWORD = 'password123';

export const testUser: GetProfileResponse = {
  id: 'user-000',
  firstName: 'Admin',
  lastName: 'User',
  email: TEST_USER_EMAIL,
  phone: '+1-555-0000-0000',
  status: UserStatus.Active,
  roles: [{ userRoleId: 'role-0', role: UserProfileRole.Admin }],
  isGuest: false,
  isEmailVerified: true,
};

export const mockUsers: GetProfileResponse[] = [
  testUser,
  ...Array.from({ length: 49 }, (_, i) => createMockUser(i + 1)),
];

export function findUserByEmail(email: string): GetProfileResponse | undefined {
  return mockUsers.find((u) => u.email === email);
}
