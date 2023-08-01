public class Emailclass {
  public static Boolean isValidEmailFormat(String email) {
    String emailRegex = '^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
    return Pattern.matches(emailRegex, email);
  }


  public static void saveRecord(String email) {
    if (!isValidEmailFormat(email)) {
      // Display error message or handle invalid email format
      return;
    }
    // Save the record or perform other actions
  }
}