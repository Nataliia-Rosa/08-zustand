interface ErrorMessageProps {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return <div>Error: {message}</div>;
};

export default ErrorMessage;
