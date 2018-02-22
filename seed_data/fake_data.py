from faker import Faker
from datetime import datetime
import random

fake = Faker()
fake.seed(7890)
random.seed(1234)

# Users- 8 users ###############################################################
# for _ in range(0, 5):
#     print (fake.first_name()+'|'+fake.last_name()+'|'+fake.user_name()
#     +'|'+fake.password()+'|'+fake.word()+'|'+fake.phone_number()+'|'+
#     fake.street_address()+'|'+fake.city()+'|'+fake.state_abbr()+'|'+
#     fake.postalcode())


# Sessions- 40 sessions for 8 users ############################################
# for _ in range(0, 40):
#     print random.randint(1, 8)


# Records ######################################################################
user_ids = [4, 4, 4, 4, 5,
            5, 2, 6, 1, 2,
            5, 7, 5, 1, 3,
            3, 1, 4, 2, 3,
            6, 4, 2, 7, 3,
            3, 3, 6, 7, 6,
            6, 7, 1, 7, 1,
            8, 7, 1, 8, 4]

days = [1519200000, 1519200000, 1519200000, 1519200000, 1519113600,
        1519113600, 1519113600, 1519027200, 1519027200, 1519027200,
        1518940800, 1518940800, 1518854400, 1518854400, 1518768000,
        1518681600, 1518681600, 1518681600, 1518681600, 1518681600,
        1518595200, 1518595200, 1518595200, 1518595200, 1518508800,
        1518422400, 1518422400, 1518422400, 1518422400, 1518336000,
        1518336000, 1518336000, 1518336000, 1518249600, 1518249600,
        1518163200, 1518163200, 1518076800, 1517990400, 1517904000]

for i, user_id in enumerate(user_ids):
    act_qty = random.randint(5, 13)
    selected_activities = set()

    for _ in range(0, act_qty):
        act_id = random.randint(1, 13)
        selected_activities.add(act_id)

    day = days[-(i + 1)]
    start = day + 33000
    total_time = 0

    for act_id in selected_activities:
        act_time = random.randint(120, 1000)

        start_t = start + total_time
        end_t = datetime.fromtimestamp(start_t + act_time)
        start_t = datetime.fromtimestamp(start_t)

        total_time += act_time

        print (str(user_id) + '|' + str(i + 1) + '|' + str(act_id) + '|' +
               str(start_t) + '|' + str(end_t))
