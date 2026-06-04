
export function getBorderColor(type: string): string {
  switch (type) {
    case 'Delete': return 'red';
    case 'Error': return 'darkred';
    case 'OK': return 'green';
    default: return 'gray';
  }
}

