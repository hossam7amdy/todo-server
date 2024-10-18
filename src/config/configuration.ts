const _parseInt = (value: string | undefined, defaultValue: number) => {
  return value ? parseInt(value, 10) : defaultValue;
};

/** Recursively loop through the configuration object
 * and log warnings for missing environment variables
 */
const validateConfiguration = (
  config: { [key: string]: any },
  path: string,
) => {
  for (const key in config) {
    if (typeof config[key] === 'object') {
      validateConfiguration(config[key], `${path}.${key}`);
    } else if (!config[key]) {
      // eslint-disable-next-line no-console
      console.warn(`Missing environment variable: ${path}.${key}`);
    }
  }
};

const configuration = () => ({
  port: _parseInt(process.env.PORT, 3000),
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      resetSecret: process.env.JWT_VERIFY_SECRET,
      verifySecret: process.env.JWT_RESET_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  mail: {
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: _parseInt(process.env.EMAIL_PORT, 2525),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

type Configuration = ReturnType<typeof configuration>;

export { type Configuration, validateConfiguration };
export default configuration;
