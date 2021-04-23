export function convertDurationToTimeString(duration: number) {
  // Math florr para convertr o numero pra baixo quando ficar quebrado exemplo 0.83H vai ser 0 horas
  const hours = Math.floor(duration / 3600);
  // pegar o resto da hours
  const minutes = Math.floor((duration % 3600) / 60);
  // pegar o resto de minutos para fazer secons
  const seconds = duration % 60;

  const timeStrig = [hours, minutes, seconds]
    .map((unit) =>
      // A funcao padStart faz qualquer caracter que tiver nesse map ter um 0 na frente apenas se ele tiver 1 caracter
      String(unit).padStart(2, "0")
    )
    .join(":");

  return timeStrig;
}
