import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"

export default function DevAlert({language, setShowAlert}: any) {
  return (
    <div className="login-alert-container">
          <Alert variant="login">
            <InfoIcon color="white"/>
            <AlertTitle>{language === "en" ? "Note from developer:" : "Nota do desenvolvedor:"}</AlertTitle>
            <AlertDescription>
              {language === "en" ? "This might take a few seconds, server is starting up." : "Isso pode demorar alguns segundos, o servidor está iniciando."}
            </AlertDescription>
            <AlertAction>
              <Button variant="outline" size="xs" onClick={() => setShowAlert(false)}>
                {language === "en" ? "Dismiss" : "Fechar"}
              </Button>
            </AlertAction>
          </Alert>
        </div>
  )
}