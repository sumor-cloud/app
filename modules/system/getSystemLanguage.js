import { osLocale } from 'os-locale'

export default async () => {
  let language = process.env.LANGUAGE
  if (!language) {
    language = await osLocale()
  }
  return language
}
