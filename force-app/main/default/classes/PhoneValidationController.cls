public class PhoneValidationController {
  @AuraEnabled(cacheable=true)
  public static ValidationResponse validatePhone(String phoneNumber) {
    ValidationResponse response = new ValidationResponse();

    // Perform the phone validation logic
    // You can use regular expressions or any other validation logic here
    Pattern phonePattern = Pattern.compile('^[0-9]+$');
    Matcher phoneMatcher = phonePattern.matcher(phoneNumber);
    
    if (!phoneMatcher.matches()) {
      response.isValid = false;
      response.errorMessage = 'Please enter only numeric values.';
    } else {
      response.isValid = true;
    }

    return response;
  }

  public class ValidationResponse {
    @AuraEnabled public Boolean isValid;
    @AuraEnabled public String errorMessage;
  }
}