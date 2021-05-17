gg_rct_Spawn0 = nil
gg_rct_Spawn1 = nil
gg_rct_Check0 = nil
gg_rct_Check1 = nil
gg_rct_Check2 = nil
gg_rct_Check3 = nil
gg_rct_Check4 = nil
gg_rct_Check5 = nil
gg_rct_PlayArea = nil
gg_rct_Spawn2 = nil
gg_rct_Spawn3 = nil
gg_rct_ClassSelection = nil
gg_rct_ModShops = nil
gg_trg_Untitled_Trigger_001 = nil
gg_trg_Untitled_Trigger_002 = nil
function InitGlobals()
end

function ItemTable000000_DropItems()
    local trigWidget = nil
    local trigUnit = nil
    local itemID = 0
    local canDrop = true
    trigWidget = bj_lastDyingWidget
    if (trigWidget == nil) then
        trigUnit = GetTriggerUnit()
    end
    if (trigUnit ~= nil) then
        canDrop = not IsUnitHidden(trigUnit)
        if (canDrop and GetChangingUnit() ~= nil) then
            canDrop = (GetChangingUnitPrevOwner() == Player(PLAYER_NEUTRAL_AGGRESSIVE))
        end
    end
    if (canDrop) then
        RandomDistReset()
        RandomDistAddItem(FourCC("modt"), 20)
        RandomDistAddItem(-1, 80)
        itemID = RandomDistChoose()
        if (trigUnit ~= nil) then
            UnitDropItem(trigUnit, itemID)
        else
            WidgetDropItem(trigWidget, itemID)
        end
    end
    bj_lastDyingWidget = nil
    DestroyTrigger(GetTriggeringTrigger())
end

function CreateNeutralHostileBuildings()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), -4608.0, 4224.0, 270.000, FourCC("h001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h004"), -4480.0, 4416.0, 270.000, FourCC("h004"))
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -4608.0, 4416.0, 270.000, FourCC("h003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -4736.0, 4416.0, 270.000, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00I"), -2560.0, 4416.0, 270.000, FourCC("h00I"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00J"), -2432.0, 4416.0, 270.000, FourCC("h00J"))
    u = BlzCreateUnitWithSkin(p, FourCC("h006"), -3584.0, 4096.0, 270.000, FourCC("h006"))
    u = BlzCreateUnitWithSkin(p, FourCC("h007"), -3584.0, 4416.0, 270.000, FourCC("h007"))
    u = BlzCreateUnitWithSkin(p, FourCC("h008"), -3712.0, 4416.0, 270.000, FourCC("h008"))
    u = BlzCreateUnitWithSkin(p, FourCC("h009"), -3456.0, 4416.0, 270.000, FourCC("h009"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00A"), -3584.0, 4288.0, 270.000, FourCC("h00A"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00B"), -3456.0, 4288.0, 270.000, FourCC("h00B"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00C"), -3712.0, 4288.0, 270.000, FourCC("h00C"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00D"), -3584.0, 4544.0, 270.000, FourCC("h00D"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00E"), -3456.0, 4544.0, 270.000, FourCC("h00E"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00F"), -3712.0, 4544.0, 270.000, FourCC("h00F"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00G"), -2560.0, 4096.0, 270.000, FourCC("h00G"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00H"), -1536.0, 4096.0, 270.000, FourCC("h00H"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00K"), -2688.0, 4416.0, 270.000, FourCC("h00K"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00L"), -2560.0, 4544.0, 270.000, FourCC("h00L"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00M"), -2688.0, 4544.0, 270.000, FourCC("h00M"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00N"), -2432.0, 4544.0, 270.000, FourCC("h00N"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00O"), -2560.0, 4288.0, 270.000, FourCC("h00O"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00Q"), -2688.0, 4288.0, 270.000, FourCC("h00Q"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00P"), -2432.0, 4288.0, 270.000, FourCC("h00P"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00R"), -1664.0, 4544.0, 270.000, FourCC("h00R"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00S"), -1536.0, 4544.0, 270.000, FourCC("h00S"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00T"), -1664.0, 4416.0, 270.000, FourCC("h00T"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00U"), -1536.0, 4416.0, 270.000, FourCC("h00U"))
    u = BlzCreateUnitWithSkin(p, FourCC("h00V"), -1664.0, 4288.0, 270.000, FourCC("h00V"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 4624.7, 4978.5, 270.000, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 4712.7, 4990.7, 270.000, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n007"), 4794.3, 4982.1, 270.000, FourCC("n007"))
    u = BlzCreateUnitWithSkin(p, FourCC("n006"), 4873.9, 4996.1, 270.000, FourCC("n006"))
    u = BlzCreateUnitWithSkin(p, FourCC("n005"), 4965.5, 4986.4, 270.000, FourCC("n005"))
    u = BlzCreateUnitWithSkin(p, FourCC("n004"), 5068.3, 4999.0, 270.000, FourCC("n004"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 5147.2, 4996.1, 270.000, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n002"), 5232.9, 4996.6, 270.000, FourCC("n002"))
end

function CreateNeutralPassiveBuildings()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n008"), 4608.0, -4800.0, 270.000, FourCC("n008"))
    SetUnitColor(u, ConvertPlayerColor(0))
    u = BlzCreateUnitWithSkin(p, FourCC("n00C"), -3328.0, 192.0, 270.000, FourCC("n00C"))
    u = BlzCreateUnitWithSkin(p, FourCC("n00A"), -3520.0, -768.0, 270.000, FourCC("n00A"))
    u = BlzCreateUnitWithSkin(p, FourCC("n00B"), -3776.0, -384.0, 270.000, FourCC("n00B"))
    u = BlzCreateUnitWithSkin(p, FourCC("n009"), -2880.0, -384.0, 270.000, FourCC("n009"))
    u = BlzCreateUnitWithSkin(p, FourCC("n00D"), -3712.0, 0.0, 270.000, FourCC("n00D"))
    u = BlzCreateUnitWithSkin(p, FourCC("n00E"), -3136.0, -768.0, 270.000, FourCC("n00E"))
    u = BlzCreateUnitWithSkin(p, FourCC("n00F"), -2944.0, 0.0, 270.000, FourCC("n00F"))
end

function CreateNeutralPassive()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("u001"), 4378.2, -4499.7, 270.000, FourCC("u001"))
    u = BlzCreateUnitWithSkin(p, FourCC("u000"), 4476.1, -4502.2, 270.000, FourCC("u000"))
    u = BlzCreateUnitWithSkin(p, FourCC("u003"), 4557.2, -4495.4, 270.000, FourCC("u003"))
    u = BlzCreateUnitWithSkin(p, FourCC("u002"), 4658.2, -4501.4, 270.000, FourCC("u002"))
    u = BlzCreateUnitWithSkin(p, FourCC("u004"), 4750.6, -4509.8, 271.870, FourCC("u004"))
    u = BlzCreateUnitWithSkin(p, FourCC("u005"), 4834.3, -4508.1, 261.820, FourCC("u005"))
end

function CreatePlayerBuildings()
end

function CreatePlayerUnits()
end

function CreateAllUnits()
    CreateNeutralHostileBuildings()
    CreateNeutralPassiveBuildings()
    CreatePlayerBuildings()
    CreateNeutralHostile()
    CreateNeutralPassive()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_Spawn0 = Rect(1248.0, 3008.0, 1312.0, 3072.0)
    gg_rct_Spawn1 = Rect(3008.0, -1312.0, 3072.0, -1248.0)
    gg_rct_Check0 = Rect(-1312.0, -1312.0, -1248.0, -1248.0)
    gg_rct_Check1 = Rect(-32.0, -1312.0, 32.0, -1248.0)
    gg_rct_Check2 = Rect(-32.0, 1248.0, 32.0, 1312.0)
    gg_rct_Check3 = Rect(1248.0, 1248.0, 1312.0, 1312.0)
    gg_rct_Check4 = Rect(1248.0, -32.0, 1312.0, 32.0)
    gg_rct_Check5 = Rect(-1312.0, -32.0, -1248.0, 32.0)
    gg_rct_PlayArea = Rect(-2240.0, -2240.0, 2240.0, 2240.0)
    gg_rct_Spawn2 = Rect(-1312.0, -3072.0, -1248.0, -3008.0)
    gg_rct_Spawn3 = Rect(-3072.0, 1248.0, -3008.0, 1312.0)
    gg_rct_ClassSelection = Rect(4192.0, -5280.0, 5024.0, -4448.0)
    gg_rct_ModShops = Rect(-3968.0, -1152.0, -2688.0, 512.0)
end

function Trig_Untitled_Trigger_001_Actions()
end

function InitTrig_Untitled_Trigger_001()
    gg_trg_Untitled_Trigger_001 = CreateTrigger()
    TriggerAddAction(gg_trg_Untitled_Trigger_001, Trig_Untitled_Trigger_001_Actions)
end

function Trig_Untitled_Trigger_002_Actions()
end

function InitTrig_Untitled_Trigger_002()
    gg_trg_Untitled_Trigger_002 = CreateTrigger()
    TriggerAddAction(gg_trg_Untitled_Trigger_002, Trig_Untitled_Trigger_002_Actions)
end

function InitCustomTriggers()
    InitTrig_Untitled_Trigger_001()
    InitTrig_Untitled_Trigger_002()
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(1), false)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(2), false)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(4), 4)
    ForcePlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), false)
    SetPlayerController(Player(4), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(5), 5)
    ForcePlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(5), false)
    SetPlayerController(Player(5), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(10), 6)
    ForcePlayerStartLocation(Player(10), 6)
    SetPlayerColor(Player(10), ConvertPlayerColor(10))
    SetPlayerRacePreference(Player(10), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(10), false)
    SetPlayerController(Player(10), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(11), 7)
    ForcePlayerStartLocation(Player(11), 7)
    SetPlayerColor(Player(11), ConvertPlayerColor(11))
    SetPlayerRacePreference(Player(11), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(11), false)
    SetPlayerController(Player(11), MAP_CONTROL_COMPUTER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerTeam(Player(1), 0)
    SetPlayerTeam(Player(2), 0)
    SetPlayerTeam(Player(3), 0)
    SetPlayerTeam(Player(4), 0)
    SetPlayerTeam(Player(5), 0)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(5), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(5), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(5), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(5), Player(4), true)
    SetPlayerTeam(Player(10), 1)
    SetPlayerTeam(Player(11), 1)
    SetPlayerAllianceStateAllyBJ(Player(10), Player(11), true)
    SetPlayerAllianceStateAllyBJ(Player(11), Player(10), true)
    SetPlayerAllianceStateVisionBJ(Player(10), Player(11), true)
    SetPlayerAllianceStateVisionBJ(Player(11), Player(10), true)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 5)
    SetStartLocPrio(0, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 5)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 5)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 5)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 3, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 5)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 4, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 5)
    SetStartLocPrio(5, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 4, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(6, 3)
    SetStartLocPrio(6, 0, 0, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(6, 1, 1, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(6, 2, 7, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(6, 2)
    SetEnemyStartLocPrio(6, 0, 1, MAP_LOC_PRIO_HIGH)
    SetEnemyStartLocPrio(6, 1, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(7, 1)
    SetStartLocPrio(7, 0, 5, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrioCount(7, 4)
    SetEnemyStartLocPrio(7, 0, 0, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(7, 1, 1, MAP_LOC_PRIO_LOW)
    SetEnemyStartLocPrio(7, 2, 5, MAP_LOC_PRIO_LOW)
end

function main()
    SetCameraBounds(-5376.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -5632.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 5376.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 5120.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -5376.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 5120.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 5376.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -5632.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCDalaran\\DNCDalaranTerrain\\DNCDalaranTerrain.mdl", "Environment\\DNC\\DNCDalaran\\DNCDalaranUnit\\DNCDalaranUnit.mdl")
    NewSoundEnvironment("Default")
    SetAmbientDaySound("DalaranDay")
    SetAmbientNightSound("DalaranNight")
    SetMapMusic("Music", true, 0)
    CreateRegions()
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
end

function config()
    SetMapName("TRIGSTR_001")
    SetMapDescription("")
    SetPlayers(8)
    SetTeams(8)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, 0.0, 0.0)
    DefineStartLocation(1, 0.0, 0.0)
    DefineStartLocation(2, 0.0, 0.0)
    DefineStartLocation(3, 0.0, 0.0)
    DefineStartLocation(4, 0.0, 0.0)
    DefineStartLocation(5, 0.0, 0.0)
    DefineStartLocation(6, 1280.0, 2944.0)
    DefineStartLocation(7, -1280.0, -3008.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

