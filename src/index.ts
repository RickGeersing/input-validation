export type InputValidationVariant = "required" | "email" | "string"
export type InputValidationErrorVariant = InputValidationVariant | "unexpected"
export type InputValidationErrors = {
    [key: string]: InputValidationErrorVariant[]
}
export type InputValidationSchema = {
    [key: string]: InputValidationVariant[]
}
export type InputValidationResult = {
    valid: boolean
    errors?: InputValidationErrors
}

export function validate(input: any, schema: InputValidationSchema): InputValidationResult {
    const errors: InputValidationErrors = {}
    const inputKeys = Object.keys(input)
    const schemaKeys = Object.keys(schema)

    for (const key of inputKeys) {
        if (!schemaKeys.includes(key)) {
            errors[key] = ["unexpected"]
            break
        }

        const invalidVariants = validateInput(input[key], schema[key])
        if (invalidVariants) {
            errors[key] = invalidVariants
        }
        console.log(key)
    }

    // Missing keys
    for (const key of schemaKeys) {
        if (!inputKeys.includes(key)) {
            errors[key] = schema[key]
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length > 0 ? errors : undefined
    }
}

function validateInput(input: any, variants: InputValidationVariant[]): InputValidationErrorVariant[] | false {
    const invalidVariants: InputValidationErrorVariant[] = []

    for (const variant of variants) {
        switch (variant) {
            case "required":
                if (input === undefined || input === null || input === "") {
                    invalidVariants.push(variant)
                }
                break
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input)) {
                    invalidVariants.push(variant)
                }
                break
            case "string":
                if (typeof input !== "string") {
                    invalidVariants.push(variant)
                }
                break
        }
    }

    return invalidVariants.length > 0 
        ? invalidVariants
        : false
}