class BookingRequest {
    constructor({ tour, date, people, accommodation, name, email, phone, comments, agree }) {
        this.tour = tour;
        this.date = date;
        this.people = Number(people);
        this.accommodation = accommodation;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.comments = comments;
        this.agree = agree;
    }

    logFormatted() {
        console.group('Заявка на бронирование');
        console.log(`Тур: ${this.tour}`);
        console.log(`Дата начала: ${this.date}`);
        console.log(`Количество человек: ${this.people}`);
        console.log(`Размещение: ${this.accommodation}`);
        console.log(`ФИО: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Телефон: ${this.phone}`);
        console.log(`Комментарий: ${this.comments || 'нет'}`);
        console.log(`Согласие: ${this.agree ? 'получено' : 'не подтверждено'}`);
        console.groupEnd();
    }
}

// Класс для валидации форм
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.hints = {};
    }

    // Создание элемента подсказки
    createHintElement(input) {
        const hintId = `${input.id}-hint`;
        let hintElement = document.getElementById(hintId);
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = hintId;
            hintElement.className = 'form-hint';
            input.parentElement.appendChild(hintElement);
        }
        return hintElement;
    }

    // Отображение подсказки
    showHint(input, message, isValid = true) {
        const hintElement = this.createHintElement(input);
        hintElement.textContent = message;
        hintElement.className = `form-hint ${isValid ? 'hint-valid' : 'hint-invalid'}`;
        input.classList.toggle('input-invalid', !isValid);
        input.classList.toggle('input-valid', isValid);
    }

    // Скрытие подсказки
    hideHint(input) {
        const hintId = `${input.id}-hint`;
        const hintElement = document.getElementById(hintId);
        if (hintElement) {
            hintElement.remove();
        }
        input.classList.remove('input-invalid', 'input-valid');
    }

    // Валидация имени
    validateName(name) {
        if (!name.trim()) {
            return { valid: false, message: 'Пожалуйста, введите ваше ФИО' };
        }
        if (name.trim().length < 3) {
            return { valid: false, message: 'ФИО должно содержать минимум 3 символа' };
        }
        if (!/^[А-Яа-яЁё\s-]+$/.test(name.trim())) {
            return { valid: false, message: 'ФИО должно содержать только буквы русского алфавита' };
        }
        return { valid: true, message: '✓ Корректное ФИО' };
    }

    // Валидация email
    validateEmail(email) {
        if (!email.trim()) {
            return { valid: false, message: 'Пожалуйста, введите email' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return { valid: false, message: 'Введите корректный email (например: user@example.com)' };
        }
        return { valid: true, message: '✓ Корректный email' };
    }

    // Валидация телефона
    validatePhone(phone) {
        if (!phone.trim()) {
            return { valid: false, message: 'Пожалуйста, введите номер телефона' };
        }
        const phoneRegex = /^[\d\s()+-]+$/;
        if (!phoneRegex.test(phone.trim())) {
            return { valid: false, message: 'Телефон должен содержать только цифры, пробелы и символы +, -, (, )' };
        }
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return { valid: false, message: 'Номер телефона должен содержать минимум 10 цифр' };
        }
        return { valid: true, message: '✓ Корректный номер телефона' };
    }

    // Валидация даты
    validateDate(date) {
        if (!date) {
            return { valid: false, message: 'Пожалуйста, выберите дату начала тура' };
        }
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return { valid: false, message: 'Дата не может быть в прошлом' };
        }
        return { valid: true, message: '✓ Дата выбрана корректно' };
    }

    // Валидация количества человек
    validatePeople(people) {
        const num = parseInt(people);
        if (!people || isNaN(num)) {
            return { valid: false, message: 'Пожалуйста, введите количество человек' };
        }
        if (num < 1) {
            return { valid: false, message: 'Количество человек должно быть минимум 1' };
        }
        if (num > 10) {
            return { valid: false, message: 'Максимальное количество человек - 10' };
        }
        return { valid: true, message: '✓ Корректное количество человек' };
    }

    // Валидация выбора тура
    validateTour(tour) {
        if (!tour) {
            return { valid: false, message: 'Пожалуйста, выберите тур' };
        }
        return { valid: true, message: '✓ Тур выбран' };
    }

    // Валидация размещения
    validateAccommodation(accommodation) {
        if (!accommodation) {
            return { valid: false, message: 'Пожалуйста, выберите тип размещения' };
        }
        return { valid: true, message: '✓ Тип размещения выбран' };
    }

    // Общая валидация формы
    validateForm(formData) {
        let isValid = true;

        const nameValidation = this.validateName(formData.name);
        if (!nameValidation.valid) isValid = false;

        const emailValidation = this.validateEmail(formData.email);
        if (!emailValidation.valid) isValid = false;

        const phoneValidation = this.validatePhone(formData.phone);
        if (!phoneValidation.valid) isValid = false;

        const dateValidation = this.validateDate(formData.date);
        if (!dateValidation.valid) isValid = false;

        const peopleValidation = this.validatePeople(formData.people);
        if (!peopleValidation.valid) isValid = false;

        const tourValidation = this.validateTour(formData.tour);
        if (!tourValidation.valid) isValid = false;

        const accommodationValidation = this.validateAccommodation(formData.accommodation);
        if (!accommodationValidation.valid) isValid = false;

        if (!formData.agree) {
            isValid = false;
        }

        return isValid;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const validator = new FormValidator(form);
    const submitButton = form.querySelector('button[type="submit"]');

    // Получение параметра тура из URL
    const urlParams = new URLSearchParams(window.location.search);
    const tourParam = urlParams.get('tour');
    if (tourParam) {
        form.tour.value = tourParam;
    }

    // Установка минимальной даты (сегодня)
    const dateInput = form.date;
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Валидация имени в реальном времени
    form.name.addEventListener('input', (e) => {
        const validation = validator.validateName(e.target.value);
        if (e.target.value.trim()) {
            validator.showHint(e.target, validation.message, validation.valid);
        } else {
            validator.hideHint(e.target);
        }
    });

    form.name.addEventListener('blur', (e) => {
        const validation = validator.validateName(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация email в реальном времени
    form.email.addEventListener('input', (e) => {
        const validation = validator.validateEmail(e.target.value);
        if (e.target.value.trim()) {
            validator.showHint(e.target, validation.message, validation.valid);
        } else {
            validator.hideHint(e.target);
        }
    });

    form.email.addEventListener('blur', (e) => {
        const validation = validator.validateEmail(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация телефона в реальном времени
    form.phone.addEventListener('input', (e) => {
        const validation = validator.validatePhone(e.target.value);
        if (e.target.value.trim()) {
            validator.showHint(e.target, validation.message, validation.valid);
        } else {
            validator.hideHint(e.target);
        }
    });

    form.phone.addEventListener('blur', (e) => {
        const validation = validator.validatePhone(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация даты в реальном времени
    form.date.addEventListener('change', (e) => {
        const validation = validator.validateDate(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация количества человек в реальном времени
    form.people.addEventListener('input', (e) => {
        const validation = validator.validatePeople(e.target.value);
        if (e.target.value) {
            validator.showHint(e.target, validation.message, validation.valid);
        } else {
            validator.hideHint(e.target);
        }
    });

    form.people.addEventListener('blur', (e) => {
        const validation = validator.validatePeople(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация выбора тура
    form.tour.addEventListener('change', (e) => {
        const validation = validator.validateTour(e.target.value);
        validator.showHint(e.target, validation.message, validation.valid);
    });

    // Валидация размещения
    const accommodationInputs = form.querySelectorAll('input[name="accommodation"]');
    accommodationInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const validation = validator.validateAccommodation(form.accommodation.value);
            accommodationInputs.forEach(inp => {
                validator.showHint(inp, validation.message, validation.valid);
            });
        });
    });

    // Обработка отправки формы
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            tour: form.tour.value,
            date: form.date.value,
            people: form.people.value,
            accommodation: form.accommodation.value,
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            comments: form.comments.value.trim(),
            agree: form.agree.checked
        };

        // Валидация всех полей перед отправкой
        if (!validator.validateForm(formData)) {
            alert('Пожалуйста, исправьте ошибки в форме перед отправкой.');
            return;
        }

        const booking = new BookingRequest(formData);
        booking.logFormatted();

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            const response = await fetch('http://localhost:8000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Статус ответа: ${response.status}`);
            }

            const result = await response.json();
            alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время!');
            form.reset();
            
            // Очистка всех подсказок
            const hints = form.querySelectorAll('.form-hint');
            hints.forEach(hint => hint.remove());
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => input.classList.remove('input-invalid', 'input-valid'));
        } catch (error) {
            console.error('Ошибка отправки данных', error);
            alert('Не удалось отправить заявку. Убедитесь, что mock-json-server запущен на http://localhost:8000');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Забронировать тур';
        }
    });
});

