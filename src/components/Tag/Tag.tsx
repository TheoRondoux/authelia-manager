export interface TagProps {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const Tag = ({text, variant = 'primary'}: TagProps) => {
    const colorClasses = {
        primary: 'bg-purple-100 text-purple-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[variant]}`}>
            {text}
        </span>
    );
}
export default Tag;