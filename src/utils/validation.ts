/**
 * Validation utilities for maintaining data integrity
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates a string field with length constraints
 */
export function validateString(
    value: string,
    fieldName: string,
    options: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
    } = {}
): ValidationResult {
    const trimmed = value.trim();

    if (options.required && !trimmed) {
        return { valid: false, error: `${fieldName} is required` };
    }

    if (options.minLength && trimmed.length < options.minLength) {
        return {
            valid: false,
            error: `${fieldName} must be at least ${options.minLength} characters`,
        };
    }

    if (options.maxLength && trimmed.length > options.maxLength) {
        return {
            valid: false,
            error: `${fieldName} must be less than ${options.maxLength} characters`,
        };
    }

    return { valid: true };
}

/**
 * Validates a number with range constraints
 */
export function validateNumber(
    value: number | string,
    fieldName: string,
    options: {
        required?: boolean;
        min?: number;
        max?: number;
        integer?: boolean;
    } = {}
): ValidationResult {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        if (options.required) {
            return { valid: false, error: `${fieldName} must be a valid number` };
        }
        return { valid: true };
    }

    if (options.integer && !Number.isInteger(num)) {
        return { valid: false, error: `${fieldName} must be a whole number` };
    }

    if (options.min !== undefined && num < options.min) {
        return { valid: false, error: `${fieldName} must be at least ${options.min}` };
    }

    if (options.max !== undefined && num > options.max) {
        return { valid: false, error: `${fieldName} must be at most ${options.max}` };
    }

    return { valid: true };
}

/**
 * Validates a date string
 */
export function validateDate(
    value: string,
    fieldName: string,
    options: {
        required?: boolean;
        notInPast?: boolean;
        notInFuture?: boolean;
        maxYearsAgo?: number;
        maxYearsAhead?: number;
    } = {}
): ValidationResult {
    if (!value && options.required) {
        return { valid: false, error: `${fieldName} is required` };
    }

    if (!value) {
        return { valid: true };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return { valid: false, error: `${fieldName} must be a valid date` };
    }

    const now = new Date();

    if (options.notInPast && date < now) {
        return { valid: false, error: `${fieldName} cannot be in the past` };
    }

    if (options.notInFuture && date > now) {
        return { valid: false, error: `${fieldName} cannot be in the future` };
    }

    if (options.maxYearsAgo) {
        const minDate = new Date();
        minDate.setFullYear(now.getFullYear() - options.maxYearsAgo);
        if (date < minDate) {
            return {
                valid: false,
                error: `${fieldName} cannot be more than ${options.maxYearsAgo} years ago`,
            };
        }
    }

    if (options.maxYearsAhead) {
        const maxDate = new Date();
        maxDate.setFullYear(now.getFullYear() + options.maxYearsAhead);
        if (date > maxDate) {
            return {
                valid: false,
                error: `${fieldName} cannot be more than ${options.maxYearsAhead} years ahead`,
            };
        }
    }

    return { valid: true };
}

/**
 * Sanitizes user input to prevent potential issues
 */
export function sanitizeString(value: string, maxLength = 1000): string {
    return value
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Validates student data
 */
export function validateStudentData(data: {
    name: string;
    grade: string;
    age?: number | string;
    dob?: string;
    school?: string;
    classDetails?: string;
    binderNotes?: string;
}): ValidationResult {
    // Name validation
    const nameResult = validateString(data.name, 'Name', {
        required: true,
        minLength: 2,
        maxLength: 100,
    });
    if (!nameResult.valid) return nameResult;

    // Grade validation
    const gradeResult = validateString(data.grade, 'Grade', {
        required: true,
        maxLength: 50,
    });
    if (!gradeResult.valid) return gradeResult;

    // Age validation (optional)
    if (data.age !== undefined && data.age !== '') {
        const ageResult = validateNumber(data.age, 'Age', {
            min: 1,
            max: 150,
            integer: true,
        });
        if (!ageResult.valid) return ageResult;
    }

    // DOB validation (optional)
    if (data.dob) {
        const dobResult = validateDate(data.dob, 'Date of Birth', {
            notInFuture: true,
            maxYearsAgo: 150,
        });
        if (!dobResult.valid) return dobResult;
    }

    // Optional text fields with length limits
    if (data.school) {
        const schoolResult = validateString(data.school, 'School', { maxLength: 200 });
        if (!schoolResult.valid) return schoolResult;
    }

    if (data.classDetails) {
        const classResult = validateString(data.classDetails, 'Class Details', {
            maxLength: 200,
        });
        if (!classResult.valid) return classResult;
    }

    if (data.binderNotes) {
        const notesResult = validateString(data.binderNotes, 'Notes', { maxLength: 5000 });
        if (!notesResult.valid) return notesResult;
    }

    return { valid: true };
}

/**
 * Validates class event data
 */
export function validateClassEvent(data: {
    title: string;
    start: string;
    end: string;
    durationMin?: number;
}): ValidationResult {
    // Title validation
    const titleResult = validateString(data.title, 'Title', {
        required: true,
        maxLength: 200,
    });
    if (!titleResult.valid) return titleResult;

    // Start date validation
    const startResult = validateDate(data.start, 'Start time', {
        required: true,
        maxYearsAhead: 5,
    });
    if (!startResult.valid) return startResult;

    // End date validation
    const endResult = validateDate(data.end, 'End time', {
        required: true,
        maxYearsAhead: 5,
    });
    if (!endResult.valid) return endResult;

    // Check end is after start
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    if (endDate <= startDate) {
        return { valid: false, error: 'End time must be after start time' };
    }

    // Duration validation (if provided)
    if (data.durationMin) {
        const durationResult = validateNumber(data.durationMin, 'Duration', {
            min: 15,
            max: 480, // 8 hours max
            integer: true,
        });
        if (!durationResult.valid) return durationResult;
    }

    return { valid: true };
}

/**
 * Validates extra class request data
 */
export function validateExtraRequest(data: {
    durationMin: number;
    notes?: string;
}): ValidationResult {
    const durationResult = validateNumber(data.durationMin, 'Duration', {
        required: true,
        min: 15,
        max: 480,
        integer: true,
    });
    if (!durationResult.valid) return durationResult;

    if (data.notes) {
        const notesResult = validateString(data.notes, 'Notes', { maxLength: 1000 });
        if (!notesResult.valid) return notesResult;
    }

    return { valid: true };
}
