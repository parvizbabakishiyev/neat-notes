import capitalizeFirstLetter from './capitalize-first-letter';

export default function errorParser(frontErrors, apiErrors) {
  let genericError = '';
  // generic errors do not contain 'errors' array
  const isGeneric = !apiErrors?.data?.errors;

  // handle generic backend errors, applies to only backend
  if (isGeneric) genericError = capitalizeFirstLetter(apiErrors?.data?.message);

  if (apiErrors?.message === 'Failed to fetch')
    // network error
    genericError = 'Application is not online, please try again later';

  // handle field-specific errors, first frontend then backend
  const fieldErrorFinder = findField => {
    // backend errors for invalid_input errorCode
    const errs = apiErrors?.data?.errors || [];
    const err = errs.find(({ field }) => field === findField)?.message;

    const frontError = frontErrors?.[findField]?.message;
    return frontError || capitalizeFirstLetter(err);
  };

  return { genericError, fieldErrorFinder };
}
