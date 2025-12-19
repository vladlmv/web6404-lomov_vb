// Класс для управления данными туров
class ToursManager {
    constructor() {
        this.apiUrl = 'http://localhost:8000/tours';
        this.updateInterval = 5 * 60 * 1000; // 5 минут в миллисекундах
        this.intervalId = null;
        this.tableBody = null;
    }

    // Инициализация
    init() {
        this.tableBody = document.querySelector('#toursTable tbody');
        if (!this.tableBody) {
            console.error('Таблица туров не найдена');
            return;
        }

        // Первоначальная загрузка данных
        this.loadTours();

        // Настройка периодической загрузки
        this.startPeriodicUpdate();
    }

    // Загрузка данных о турах
    async loadTours() {
        try {
            this.showLoading();

            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result && result.data && Array.isArray(result.data)) {
                this.renderTours(result.data);
                this.hideError();
                this.updateRefreshInfo();
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных о турах:', error);
            this.showError(`Ошибка загрузки данных: ${error.message}. Убедитесь, что mock-json-server запущен на http://localhost:8000`);
            this.renderFallbackTours();
        }
    }

    // Отображение индикатора загрузки
    showLoading() {
        if (this.tableBody) {
            const existingLoading = this.tableBody.parentElement.querySelector('.loading-indicator');
            if (existingLoading) {
                existingLoading.remove();
            }

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator';
            loadingDiv.textContent = 'Загрузка данных...';
            this.tableBody.parentElement.insertBefore(loadingDiv, this.tableBody);
        }
    }

    // Отображение сообщения об ошибке
    showError(message) {
        const container = document.querySelector('.tours-table-container') || 
                         document.querySelector('.pricing-table .container');
        
        if (container) {
            let errorDiv = container.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                const table = container.querySelector('table');
                if (table) {
                    container.insertBefore(errorDiv, table);
                } else {
                    container.appendChild(errorDiv);
                }
            }
            errorDiv.textContent = message;
        }
    }

    // Скрытие сообщения об ошибке
    hideError() {
        const container = document.querySelector('.tours-table-container') || 
                         document.querySelector('.pricing-table .container');
        if (container) {
            const errorDiv = container.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    // Обновление информации о последнем обновлении
    updateRefreshInfo() {
        const container = document.querySelector('.tours-table-container') || 
                         document.querySelector('.pricing-table');
        
        if (container) {
            let refreshInfo = container.querySelector('.refresh-info');
            if (!refreshInfo) {
                refreshInfo = document.createElement('div');
                refreshInfo.className = 'refresh-info';
                container.appendChild(refreshInfo);
            }
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            refreshInfo.textContent = `Данные обновлены: ${timeString}. Следующее обновление через 5 минут.`;
        }
    }

    // Отрисовка туров в таблице
    renderTours(tours) {
        if (!this.tableBody) return;

        // Удаляем индикатор загрузки
        const loadingIndicator = this.tableBody.parentElement.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        // Очищаем таблицу
        this.tableBody.innerHTML = '';

        // Заполняем таблицу данными
        tours.forEach(tour => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(tour.destination)}</td>
                <td>${this.escapeHtml(tour.duration)}</td>
                <td class="text-right">${this.escapeHtml(tour.price)}</td>
                <td class="text-center">${this.escapeHtml(tour.nutrition)}</td>
                <td class="text-center">${this.escapeHtml(tour.rating)}</td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    // Резервная отрисовка туров (если сервер недоступен)
    renderFallbackTours() {
        if (!this.tableBody) return;

        const loadingIndicator = this.tableBody.parentElement.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        // Используем статические данные как резерв
        const fallbackTours = [
            { destination: 'Турция', duration: '10 дней', price: '75 000 руб.', nutrition: 'Все включено', rating: '4.8/5' },
            { destination: 'Греция', duration: '12 дней', price: '90 000 руб.', nutrition: 'Завтраки', rating: '4.9/5' },
            { destination: 'Италия', duration: '14 дней', price: '100 000 руб.', nutrition: 'Завтраки', rating: '4.7/5' },
            { destination: 'Испания', duration: '11 дней', price: '85 000 руб.', nutrition: 'Полупансион', rating: '4.6/5' },
            { destination: 'Франция', duration: '13 дней', price: '105 000 руб.', nutrition: 'Завтраки', rating: '4.8/5' }
        ];

        this.renderTours(fallbackTours);
    }

    // Экранирование HTML для безопасности
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Запуск периодического обновления
    startPeriodicUpdate() {
        // Очищаем предыдущий интервал, если он существует
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Устанавливаем новый интервал
        this.intervalId = setInterval(() => {
            console.log('Периодическое обновление данных о турах...');
            this.loadTours();
        }, this.updateInterval);
    }

    // Остановка периодического обновления
    stopPeriodicUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const toursManager = new ToursManager();
    toursManager.init();

    // Остановка периодического обновления при уходе со страницы
    window.addEventListener('beforeunload', () => {
        toursManager.stopPeriodicUpdate();
    });
});

