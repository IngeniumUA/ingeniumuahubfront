export enum InteractionTypeEnum {
  missing_type = 0,
  bought = 100,
  unknown_card_specific = 300,
  linked_card_and_user = 301,
  unlinked_card_and_user = 302,
  failed_because_already_linked = 331,
  failed_because_user_not_valid = 332
}
