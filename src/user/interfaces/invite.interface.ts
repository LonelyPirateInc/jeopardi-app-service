export interface UserInvite {
  email: string;
  userType: 'owner' | 'educator' | 'guardian';
  facilityId: string;
}