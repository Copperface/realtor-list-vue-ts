export default interface FullRealtorData {
  id: number;
  guid: string;
  name: string;
  surname: string;
  register_date: string;
  uid: number;
  unit: {
    id: number,
    name: string,
    register_date: string,
  };
}
