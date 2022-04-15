const passwordHash = bcrypt.hashSync(
  password, 
  Number(process.env.SALT_ROUNDS)
);