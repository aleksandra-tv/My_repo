// Ждем загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    
    // Получаем форму и контейнер для карточек
    const form = document.getElementById('visitForm');
    const submissionsGrid = document.getElementById('submissionsGrid');
    
    // Функция для проверки формата телефона
    function validatePhone(phone) {
        // Регулярное выражение для формата +7(XXX)XXX-XX-XX
        const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }
    
    // Функция для проверки формата email
    function validateEmail(email) {
        // Проверяем наличие @ и .
        return email.includes('@') && email.includes('.');
    }
    
    // Функция для проверки заполненности всех обязательных полей
    function validateRequiredFields(formData) {
        // Проверяем текстовые поля
        if (!formData.fullname || formData.fullname.trim() === '') {
            alert('Не введено ФИО!');
            return false;
        }
        
        if (!formData.phone || formData.phone.trim() === '') {
            alert('Не введен телефон!');
            return false;
        }
        
        if (!formData.email || formData.email.trim() === '') {
            alert('Не введен email!');
            return false;
        }
        
        // Проверяем выбран ли хотя бы один чекбокс
        const checkboxes = document.querySelectorAll('input[name="exposition"]:checked');
        if (checkboxes.length === 0) {
            alert('Не выбрана ни одна экспозиция!');
            return false;
        }
        
        // Проверяем выбран ли тип экскурсии
        const tourType = document.querySelector('input[name="tourType"]:checked');
        if (!tourType) {
            alert('Не выбран вид экскурсии!');
            return false;
        }
        
        // Проверяем выбран ли день посещения
        const visitDay = document.getElementById('visitDay').value;
        if (!visitDay) {
            alert('Не выбран день посещения!');
            return false;
        }
        
        return true;
    }
    
    // Функция для создания карточки с данными
    function createSubmissionCard(formData) {
        const card = document.createElement('div');
        card.className = 'submission-card';
        
        // Получаем выбранные экспозиции
        const expositions = formData.expositions.join(', ');
        
        // Получаем вид экскурсии
        const tourTypes = {
            'guide': 'Экскурсовод',
            'audio': 'Аудио-гид',
            'self': 'Самостоятельный просмотр'
        };
        const tourType = tourTypes[formData.tourType] || formData.tourType;
        
        // Формируем содержимое карточки
        card.innerHTML = `
            <h3 class="card-title">${formData.fullname}</h3>
            <div class="card-info">
                <p><strong>Телефон:</strong> ${formData.phone}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Экспозиции:</strong> ${expositions}</p>
                <p><strong>Вид экскурсии:</strong> ${tourType}</p>
                <p><strong>День посещения:</strong> ${formData.visitDay}</p>
                ${formData.additional ? `<p><strong>Доп. информация:</strong> ${formData.additional}</p>` : ''}
            </div>
            <div class="card-footer">
                <small>Оформлено: ${new Date().toLocaleString()}</small>
            </div>
        `;
        
        return card;
    }
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(event) {
        // Отменяем стандартную отправку формы (чтобы страница не перезагружалась)
        event.preventDefault();
        
        // Собираем данные из формы
        const formData = {
            fullname: document.getElementById('fullname').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            expositions: [],
            tourType: null,
            visitDay: document.getElementById('visitDay').value,
            additional: document.getElementById('additional').value.trim()
        };
        
        // Собираем выбранные экспозиции
        const selectedExpositions = document.querySelectorAll('input[name="exposition"]:checked');
        selectedExpositions.forEach(cb => {
            // Получаем текст метки для более красивого отображения
            const label = cb.parentElement.textContent.trim();
            formData.expositions.push(label);
        });
        
        // Получаем выбранный тип экскурсии
        const selectedTourType = document.querySelector('input[name="tourType"]:checked');
        if (selectedTourType) {
            formData.tourType = selectedTourType.value;
        }
        
        // Валидация заполненности полей
        if (!validateRequiredFields(formData)) {
            return; // Прерываем выполнение, если есть ошибки
        }
        
        // Валидация телефона
        if (!validatePhone(formData.phone)) {
            alert('Телефон должен быть в формате: +7(XXX)XXX-XX-XX');
            return;
        }
        
        // Валидация email
        if (!validateEmail(formData.email)) {
            alert('Email должен содержать символы @ и .');
            return;
        }
        
        // Создаем карточку с данными
        const card = createSubmissionCard(formData);
        
        // Добавляем карточку в контейнер
        submissionsGrid.appendChild(card);
        
        // Очищаем форму
        form.reset();
        
        // Показываем сообщение об успехе
        alert('Визит успешно оформлен!');
    });
    
    // Добавляем подсказку для поля телефона (динамическое форматирование)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифры
        
        if (value.length > 0) {
            // Форматируем как +7(XXX)XXX-XX-XX
            if (value.length <= 1) {
                value = '+7';
            } else if (value.length <= 4) {
                value = '+7(' + value.substring(1, 4);
            } else if (value.length <= 7) {
                value = '+7(' + value.substring(1, 4) + ')' + value.substring(4, 7);
            } else if (value.length <= 9) {
                value = '+7(' + value.substring(1, 4) + ')' + value.substring(4, 7) + '-' + value.substring(7, 9);
            } else {
                value = '+7(' + value.substring(1, 4) + ')' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
            
            e.target.value = value;
        }
    });
});