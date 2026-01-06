
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  let dateObj: Date;
  if (typeof date === 'string') {
    // Handles 'YYYY-MM-DD' by splitting and creating a UTC date to avoid timezone issues
    const parts = date.split('-');
    if (parts.length === 3) {
      dateObj = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    } else {
       // Fallback for other string formats or the original Date string
       dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  
  // Use a specific timeZone to ensure consistency if the original date was UTC
  const timeZone = (typeof date === 'string' && date.split('-').length === 3) ? 'UTC' : undefined;

  return new Intl.DateTimeFormat('pt-BR', { timeZone }).format(dateObj);
};

export const formatDoc = (doc: string): string => {
    if(!doc) return '';
    const cleaned = doc.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
}

export const formatPhone = (phone: string): string => {
    if(!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

// List of national holidays in Brazil (MM-DD format)
const holidays = [
  '01-01', // Confraternização Universal
  '04-21', // Tiradentes
  '05-01', // Dia do Trabalho
  '09-07', // Independência do Brasil
  '10-12', // Nossa Senhora Aparecida
  '11-02', // Finados
  '11-15', // Proclamação da República
  '12-25', // Natal
];

// Note: Moveable holidays like Carnival and Corpus Christi are not included for simplicity.
const isHoliday = (date: Date): boolean => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return holidays.includes(`${month}-${day}`);
}

export const getMinShippingDateISO = (): string => {
  const date = new Date();
  let businessDaysToAdd = 15;

  while (businessDaysToAdd > 0) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(date)) {
      businessDaysToAdd--;
    }
  }

  // Format to YYYY-MM-DD for the input min attribute
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};