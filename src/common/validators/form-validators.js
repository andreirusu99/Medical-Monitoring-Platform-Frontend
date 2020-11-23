const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const dateValidator = value => {
    const re = /^\d{2}-\d{2}-\d{4}/
    return re.test(String(value)) && value.length === 10
};

const genderValidator = value => {
    const re = /^[MF]/
    return re.test(String(value))
}

const ageValidator = (value, minAge) => {
    const re = /^\d{2,3}/
    const intVal = parseInt(value)
    return (re.test(value) && intVal > minAge && intVal <= 120);
}

const numberValidator = (value, minVal) => {
    const re = /^\d/
    return re.test(value) && parseInt(value) > minVal && parseInt(value) < 10;
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        switch (rule) {
            case 'minLength':
                isValid = isValid && minLengthValidator(value, rules[rule]);
                break;

            case 'isRequired':
                isValid = isValid && requiredValidator(value);
                break;

            case 'dateValidator':
                isValid = isValid && dateValidator(value)
                break;

            case 'genderValidator':
                isValid = isValid && genderValidator(value)
                break;

            case 'ageValidator':
                isValid = isValid && ageValidator(value, rules[rule])
                break;

            case 'numberValidator':
                isValid = isValid && numberValidator(value, rules[rule])
                break;

            default:
                isValid = true;
        }

    }

    return isValid;
};

export default validate;
