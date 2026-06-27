import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Transition } from '@headlessui/react';

export default function DevAlert({language, setShowAlert, showAlert}: any) {
  
  return (
    <Transition
        show={Boolean(showAlert)}
        enter="transition duration-500 ease-out"
        enterFrom="translate-y-10 opacity-0 scale-95"
        enterTo="translate-y-0 opacity-100 scale-100"
        leave="transition duration-300 ease-in"
        leaveFrom="translate-y-0 opacity-100 scale-100"
        leaveTo="translate-y-10 opacity-0 scale-95"
      >
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
      </Transition>
  )
}