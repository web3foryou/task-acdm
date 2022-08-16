# Платформа для продажи ACDM
Платформа будет состоять из нескольких контрактов (ACDMToken, XXXToken, Staking, DAO, ACDMPlatform).

#### Описание ACDMToken
* name = ACADEM Coin
* symbol = ACDM
* decimals = 6

#### Описание XXXToken
* name = XXX Coin
* symbol = XXX
* decimals = 18

XXXToken необходимо залистить на uniswap. Первоначальная цена токена 0,00001 ETH.

### Описание Staking
Контракт стейкинга принимает ЛП токены(XXX/ETH). Застейканые токены лочатся на X_days после этого времени они могут выводить свои токены, также если пользователь участвовал в голосовании и оно не закончилось он не может вывести свой депозит.. Каждую неделю пользователям начисляются награда, 3% от их вклада. Выводить награду могут в любое время. Награда начисляется в XXXToken.
X_days устанавливается только с помощью DAO голосования.

### Описание DAO
Чтобы участвовать в DAO голосовании пользователю необходимо внести депозит в стэйкинг. Вес в голосовании зависит от депозита в стэйкинге (Например: внес в стэйкинг 100 LP, принимая участие в голосовании имею вес 100 голосов).


### Описание ACDMPlatform
Есть 2 раунда «Торговля» и «Продажа», которые следуют друг за другом, начиная с раунда продажи.
Каждый раунд длится 3 дня.

#### Основные понятия:
Раунд «Sale» - В данном раунде пользователь может купить токены ACDM по фиксируемой цене у платформы за ETH.
Раунд «Trade» - в данном раунде пользователи могут выкупать друг у друга токены ACDM за ETH.
Реферальная программа — реферальная программа имеет два уровня, пользователи получают реварды в ETH.

#### Описание раунда «Sale»:
Цена токена с каждым раундом растет и рассчитывается по формуле (смотри excel файл). Количество выпущенных токенов в каждом Sale раунде разное и зависит от общего объема торгов в раунде «Trade». Раунд может закончиться досрочно если все токены были распроданы. По окончанию раунда не распроданные токены сжигаются. Самый первый раунд продает токенны на сумму 1ETH (100 000 ACDM)
Пример расчета:
Объем торгов в trade раунде = 0,5 ETH (общая сумма ETH на которую пользователи наторговали в рамках одного trade раунд)
0,5/0,0000187 = 26737.96. (0,0000187 = цена токена в текущем раунде)
следовательно в Sale раунде будет доступно к продаже 26737.96 токенов ACDM.

#### Описание раунда «Trade»:
user_1 выставляет ордер на продажу ACDM токенов за определенную сумму в ETH. User_2 выкупает токены за ETH. Ордер может быть выкуплен не полностью. Также ордер можно отозвать и пользователю вернутся его токены, которые еще не были проданы. Полученные ETH сразу отправляются пользователю в их кошелек metamask. По окончанию раунда все открытые ордера переходят в следующий TRADE раунд..

#### Описание Реферальной программы:
При регистрации пользователь указывает своего реферера (Реферер должен быть уже зарегистрирован на платформе).
При покупке в Sale раунде токенов ACDM, рефереру_1 отправится 5%(этот параметр регулируется через DAO) от его покупки, рефереру_2 отправится 3%(этот параметр регулируется через DAO), сама платформа получит 92%, в случае отсутствия рефереров всё получает платформа.

При покупке в Trade раунде пользователь, который выставил ордер на продажу ACDM токенов получит 95% ETH и по 2,5%(этот параметр регулируется через DAO) получат рефереры, в случае их отсутствия платформа забирает эти проценты себе на специальный счет, к которому доступ есть только через DAO голосование. 

Price ETH = lastPrice*1,03+0,000004

Пример расчета: 0,0000100*1,03+0,000004 = 0,0000143

#### Sale Rounds:

* 1 = 0,0000100 ETH
* 2 = 0,0000143 ETH
* 3 = 0,0000187 ETH
* 4 = 0,0000233 ETH
* 5 = 0,0000280 ETH
* 6 = 0,0000328 ETH


#### Через ДАО голосование пользователи будут решать отдать эту комиссию овнеру или на эти ETH купить XXXToken на uniswap-е а после их сжечь.
* Написать все смарт контракты
* Написать полноценные тесты ко всей системе 
* Написать скрипты деплоя
* Задеплоить в тестовую сеть
* Написать таски на на основные методы
* Верифицировать контракты

#### Ссылки: 
* Схема https://app.diagrams.net/#G1gj3yihfvJl1WXPJtegO4N5j6q-Rd9ZMn
* Уязвимости в безопасности  https://russianblogs.com/article/857220099/
* ReentrancyGuard https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard 
* uniswap https://docs.uniswap.org/protocol/V2/introduction 
