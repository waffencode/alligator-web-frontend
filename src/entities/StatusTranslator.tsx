const statusTranslations: { [key: string]: string } = {
    NEED_REWORK: 'Требуется доработка',
    TODO: 'Сделать',
    PICKED: 'Выбрано',
    IN_PROGRESS: 'В процессе',
    TESTING: 'На тестировании',
    DONE: 'Выполнено',
    ABORTED: 'Прервано'
};

const translateStatus = (status: string | undefined): string => {
    if (!status) {
        return '';
    }

    return statusTranslations[status] || status;
};

export {translateStatus, statusTranslations};