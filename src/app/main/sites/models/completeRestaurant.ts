import { CompleteSite } from './completeSite';

export class CompleteRestaurant extends CompleteSite {
  restaurantInfoIdentifier?: number;
  openingTime?: string;
  closingDays?: string;
  isBookingPrefered?: boolean;
  numberOfSeats?: string;
  photos?: string;
  restaurantTypes?: RestaurantType[];
  restaurantSpecialies?: RestaurantSpeciality[];
  restaurantOptions?: RestaurantOption[];
}
export class RestaurantType {
  id: number;
  name: string;
}
export class RestaurantSpeciality {
  id: number;
  name: string;
}
export class RestaurantOption {
  id: number;
  name: string;
}

