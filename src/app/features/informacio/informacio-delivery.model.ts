export interface DeliverySection {
  label?: string;
  lines: string[];
}

export interface DeliveryDay {
  day: string;
  sections: DeliverySection[];
}
