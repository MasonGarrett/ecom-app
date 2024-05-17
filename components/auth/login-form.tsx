import AuthCard from './auth-card';

const LoginForm = () => {
    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new account"
            showSocials
        >
            <div>Hey</div>
        </AuthCard>
    );
};

export default LoginForm;
