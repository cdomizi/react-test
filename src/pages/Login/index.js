import {useForm, Controller} from "react-hook-form"

// MUI components
const { Stack, Typography, TextField, Button } = require("@mui/material")

const Login = () => {
  const {control} = useForm({defaultValues: {"username": "", "password": ""}})

  return (
    <Stack spacing={2} component="form">
      <Typography variant="h2">Log In</Typography>
      <Controller
      control={control}
        name="username"
        rules={{required: "Please enter your username"}}
        render={({field}) => (
          <TextField
          {...field}
          id="username"
          label="Username"
          required
          fullWidth
          margin="normal"
           />
        )}
      />
      <Controller
      control={control}
        name="password"
        rules={{required: "Please enter your password"}}
        render={({field}) => (
          <TextField
          {...field}
          id="password"
          label="Password"
          required
          type="password"
          fullWidth
          margin="normal"
           />
        )}
      />
      <Button type="submit" variant="contained">Log In</Button>
    </Stack>
  )
}

export default Login;