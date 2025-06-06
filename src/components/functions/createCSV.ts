import { type Ref } from "vue";
import emailjs from '@emailjs/browser';

const service_Id_EDIH = import.meta.env.VITE_SERVICE_ID_EDIH;
const template_Id_EDIH = import.meta.env.VITE_TEMPLATE_ID_EDIH;
const service_Id = import.meta.env.VITE_SERVICE_ID;
const template_Id = import.meta.env.VITE_TEMPLATE_ID;
const public_Key = import.meta.env.VITE_PUBLIC_KEY;

export function createCSV(Answers: Ref<any>) {
    // crate json with mapping
    const header = Answers.value
    const prefix = header.EUPSOQuestion2 ? 'EUPSO' : 'EUSME';

    //transform date
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    const formattedDate2 = `${year}-${month}-${day}`;
    const formattedDate3 = `${day}.${month}.${year}`;

    //function for 2 answers 1|1
    const questionCalc1 = (question: any, row: any) => {
        if (question) {
            let Column1 = false;
            let Column2 = false;
            if (question.hasOwnProperty(row)) {
                const rowData = question[row];
                if (rowData.hasOwnProperty("Column 1") && Array.isArray(rowData["Column 1"]) && rowData["Column 1"].includes("Yes")) {
                    Column1 = true;
                }
                if (rowData.hasOwnProperty("Column 2") && Array.isArray(rowData["Column 2"]) && rowData["Column 2"].includes("Yes")) {
                    Column2 = true;
                }
            }
            if (Column1 && Column2) {
                return '1|1';
            } else if (Column1 && !Column2) {
                return '1|0';
            } else if (!Column1 && Column2) {
                return '0|1';
            } else {
                return '0|0';
            }
        } else {
            return '0|0';
        }
    }

    //function for readiogrop with 6 answers
    const questionCalc2 = (question: any, row: any) => {
        if (question.hasOwnProperty(row)) {
            const item = question[row]["Column 1"];
            switch (item) {
                case "Item 1":
                    return 0;
                case "Item 2":
                    return 2;
                case "Item 3":
                    return 4;
                case "Item 4":
                    return 6;
                case "Item 5":
                    return 8;
                case "Item 6":
                    return 10;
                default:
                    return 0;
            }
        } else {
            return 0;
        }
    };

    //function for readiogrop with 3 answers
    const questionCalc3 = (question: any, row: any) => {
        if (question.hasOwnProperty(row)) {
            const item = question[row];
            switch (item) {
                case "Column 1":
                    return 0;
                case "Column 2":
                    return 5;
                case "Column 3":
                    return 10;
                default:
                    return 0;
            }
        } else {
            return 0;
        }
    };

    //function for readiogrop with 3 answers
    const questionCalc4 = (question: any, row: any) => {
        if (question.hasOwnProperty(row)) {
            const item = question[row];
            switch (item) {
                case "Column 1":
                    return 0;
                case "Column 2":
                    return 10;
                case "Column 3":
                    return 20;
                default:
                    return 0;
            }
        } else {
            return 0;
        }
    };


    let jsonData: any = {};
    if (header.EUDMAQuestion1 === "PSO") {
        jsonData = {
            time_point: header.EUDMAQuestion0,
            maturity_assessment_date: formattedDate,
            enterprise_name_edih: header.EUPSOQuestion2,
            fiscal_registration_number_vat: header.EUPSOQuestion3,
            //question EUPSOQuestion15
            digitalisation_needs_are_identified_m2_1_1: header.EUPSOQuestion15?.includes('Item 1') ? 1 : 0,
            financial_resources_m2_1_1: header.EUPSOQuestion15?.includes('Item 2') ? 1 : 0,
            ict_infrastructures_m2_1_1: header.EUPSOQuestion15?.includes('Item 3') ? 1 : 0,
            ict_specialists_m2_1_1: header.EUPSOQuestion15?.includes('Item 4') ? 1 : 0,
            political_commitment_m2_1_1: header.EUPSOQuestion15?.includes('Item 5') ? 1 : 0,
            organisational_units_m2_1_1: header.EUPSOQuestion15?.includes('Item 6') ? 1 : 0,
            internal_external_operational_processes_m2_1_1: header.EUPSOQuestion15?.includes('Item 7') ? 1 : 0,
            offline_services_m2_1_1: header.EUPSOQuestion15?.includes('Item 8') ? 1 : 0,
            citizens_and_other_stakeholders_m2_1_1: header.EUPSOQuestion15?.includes('Item 9') ? 1 : 0,
            risks_of_digitalisation_m2_1_1: header.EUPSOQuestion15?.includes('Item 10') ? 1 : 0,
            //question EUPSOQuestion16
            internal_operations_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 1') || '0|0',
            external_operations_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 2') || '0|0',
            policy_making_policy_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 3') || '0|0',
            provision_of_public_services_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 4') || '0|0',
            financial_administration_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 5') || '0|0',
            human_resources_management_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 6') || '0|0',
            purchasing_and_public_procurement_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 7') || '0|0',
            project_planning_m2_1_2: questionCalc1(header.EUPSOQuestion16, 'Row 8') || '0|0',
            //question EUPSOQuestion17
            connectivity_infrastructure_m2_2_3: header.EUPSOQuestion17?.includes('Item 1') ? 1 : 0,
            website_m2_2_3: header.EUPSOQuestion17?.includes('Item 2') ? 1 : 0,
            web_based_forms_and_blogs_m2_2_3: header.EUPSOQuestion17?.includes('Item 3') ? 1 : 0,
            live_chats_social_networks_m2_2_3: header.EUPSOQuestion17?.includes('Item 4') ? 1 : 0,
            remote_collaboration_tools_m2_2_3: header.EUPSOQuestion17?.includes('Item 5') ? 1 : 0,
            internal_web_portal_m2_2_3: header.EUPSOQuestion17?.includes('Item 6') ? 1 : 0,
            information_management_systems_m2_2_3: header.EUPSOQuestion17?.includes('Item 7') ? 1 : 0,
            tools_for_digital_public_services_m2_2_3: header.EUPSOQuestion17?.includes('Item 8') ? 1 : 0,
            public_procurement_tools_m2_2_3: header.EUPSOQuestion17?.includes('Item 9') ? 1 : 0,
            //question EUPSOQuestion18
            following_advanced_digital_technologies_m2_2_4__artificial_intelligence_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 1'),
            following_advanced_digital_technologies_m2_2_4__communication_technologies_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 2'),
            following_advanced_digital_technologies_m2_2_4__computing_infrastructures_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 3'),
            following_advanced_digital_technologies_m2_2_4__distributed_ledger_technologies_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 4'),
            following_advanced_digital_technologies_m2_2_4__digital_identity_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 5'),
            following_advanced_digital_technologies_m2_2_4__immersive_technologies_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 6'),
            following_advanced_digital_technologies_m2_2_4__internet_of_things_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 7'),
            following_advanced_digital_technologies_m2_2_4__software_service_technologies_m2_2_4: questionCalc2(header.EUPSOQuestion18, 'Row 8'),
            //question EUPSOQuestion19
            assesses_digital_skills_gaps_m2_3_5: header.EUPSOQuestion19?.includes('Item 1') ? 1 : 0,
            designs_a_training_plan_m2_3_5: header.EUPSOQuestion19?.includes('Item 2') ? 1 : 0,
            organises_short_trainings_m2_3_5: header.EUPSOQuestion19?.includes('Item 3') ? 1 : 0,
            facilitates_learning_m2_3_5: header.EUPSOQuestion19?.includes('Item 4') ? 1 : 0,
            offers_traineeships_m2_3_5: header.EUPSOQuestion19?.includes('Item 5') ? 1 : 0,
            sponsors_staff_participation_m2_3_5: header.EUPSOQuestion19?.includes('Item 6') ? 1 : 0,
            makes_use_of_subsidised_training_m2_3_5: header.EUPSOQuestion19?.includes('Item 7') ? 1 : 0,
            //question EUPSOQuestion20
            increases_staff_awareness_m2_3_6: header.EUPSOQuestion20?.includes('Item 1') ? 1 : 0,
            communicates_digitalisation_m2_3_6: header.EUPSOQuestion20?.includes('Item 2') ? 1 : 0,
            monitors_staff_acceptance_m2_3_6: header.EUPSOQuestion20?.includes('Item 3') ? 1 : 0,
            involves_staff_including_m2_3_6: header.EUPSOQuestion20?.includes('Item 4') ? 1 : 0,
            gives_staff_more_autonomy_m2_3_6: header.EUPSOQuestion20?.includes('Item 5') ? 1 : 0,
            redesigns_adapts_jobs_m2_3_6: header.EUPSOQuestion20?.includes('Item 6') ? 1 : 0,
            sets_up_more_flexible_working_m2_3_6: header.EUPSOQuestion20?.includes('Item 7') ? 1 : 0,
            puts_at_staff_disposal_m2_3_6: header.EUPSOQuestion20?.includes('Item 8') ? 1 : 0,
            puts_at_end_users_disposal_m2_3_6: header.EUPSOQuestion20?.includes('Item 9') ? 1 : 0,
            uses_feedback_m2_3_6: header.EUPSOQuestion20?.includes('Item 10') ? 1 : 0,
            //question EUPSOQuestion21
            the_organisation_has_in_place_m2_4_7: header.EUPSOQuestion21?.includes('Item 1') ? 1 : 0,
            not_used_paper_based_forms_m2_4_7: header.EUPSOQuestion21?.includes('Item 2') ? 1 : 0,
            data_are_stored_only_digitally_m2_4_7: header.EUPSOQuestion21?.includes('Item 3') ? 1 : 0,
            data_is_properly_integrated_m2_4_7: header.EUPSOQuestion21?.includes('Item 4') ? 1 : 0,
            data_is_accessible_m2_4_7: header.EUPSOQuestion21?.includes('Item 5') ? 1 : 0,
            collected_data_systematically_analysed_m2_4_7: header.EUPSOQuestion21?.includes('Item 6') ? 1 : 0,
            organisation_data_enriched_m2_4_7: header.EUPSOQuestion21?.includes('Item 7') ? 1 : 0,
            organisation_data_analytics_m2_4_7: header.EUPSOQuestion21?.includes('Item 8') ? 1 : 0,
            organisation_data_available_publicly_m2_4_7: header.EUPSOQuestion21?.includes('Item 9') ? 1 : 0,
            //question EUPSOQuestion22
            data_security_policy_m2_4_8: header.EUPSOQuestion22?.includes('Item 1') ? 1 : 0,
            established_plans_m2_4_8: header.EUPSOQuestion22?.includes('Item 2') ? 1 : 0,
            staff_is_regularly_informed_m2_4_8: header.EUPSOQuestion22?.includes('Item 3') ? 1 : 0,
            cyber_threats_egularly_monitored_m2_4_8: header.EUPSOQuestion22?.includes('Item 4') ? 1 : 0,
            full_backup_copy_of_critical_business_data_m2_4_8: header.EUPSOQuestion22?.includes('Item 5') ? 1 : 0,
            business_continuity_plan_m2_4_8: header.EUPSOQuestion22?.includes('Item 6') ? 1 : 0,
            //question EUPSOQuestion23
            publish_data_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 1') || '0|0',
            ensure_level_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 2') || '0|0',
            give_preference_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 3') || '0|0',
            ensure_internal_visibility_m2_9_5: questionCalc1(header.EUPSOQuestion23, 'Row 4') || '0|0',
            reuse_and_share_m2_9_5: questionCalc1(header.EUPSOQuestion23, 'Row 5') || '0|0',
            impose_any_technology_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 6') || '0|0',
            ensure_data_portability_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 7') || '0|0',
            give_end_users_options_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 8') || '0|0',
            provide_single_point_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 9') || '0|0',
            ask_users_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 10') || '0|0',
            persons_with_disabilities_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 11') || '0|0',
            services_available_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 12') || '0|0',
            ensure_data_exchange_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 13') || '0|0',
            give_priority_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 14') || '0|0',
            data_storage_formats_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 15') || '0|0',
            digital_solutions_m2_5_9: questionCalc1(header.EUPSOQuestion23, 'Row 16') || '0|0',
            //question EUPSOQuestion24
            sustainable_organisational_model_m2_6_10: header.EUPSOQuestion24?.includes('Item 1') ? 1 : 0,
            sustainable_service_provision_m2_6_10: header.EUPSOQuestion24?.includes('Item 2') ? 1 : 0,
            procurement_of_sustainable_products_m2_6_10: header.EUPSOQuestion24?.includes('Item 3') ? 1 : 0,
            emissions_pollution_m2_6_10: header.EUPSOQuestion24?.includes('Item 4') ? 1 : 0,
            sustainable_energy_generation_m2_6_10: header.EUPSOQuestion24?.includes('Item 5') ? 1 : 0,
            optimisation_of_energy_consumption_m2_6_10: header.EUPSOQuestion24?.includes('Item 6') ? 1 : 0,
            reduction_of_transport_and_packaging_costs_m2_6_10: header.EUPSOQuestion24?.includes('Item 7') ? 1 : 0,
            digital_applications_m2_6_10: header.EUPSOQuestion24?.includes('Item 8') ? 1 : 0,
            paperless_administrative_processes_m2_6_10: header.EUPSOQuestion24?.includes('Item 9') ? 1 : 0,
            //question EUPSOQuestion25
            green_digitalisation_2_likert__environmental_concerns_m2_6_11: questionCalc3(header.EUPSOQuestion25, 'Row 1'),
            green_digitalisation_2_likert__environmental_management_m2_6_11: questionCalc3(header.EUPSOQuestion25, 'Row 2'),
            green_digitalisation_2_likert__environmental_aspects_m2_6_11: questionCalc3(header.EUPSOQuestion25, 'Row 3'),
            green_digitalisation_2_likert__energy_consumption_m2_6_11: questionCalc3(header.EUPSOQuestion25, 'Row 4'),
            green_digitalisation_2_likert__recycling_reuse_m2_6_11: questionCalc3(header.EUPSOQuestion25, 'Row 5'),
        };
    }
    else if (header.EUDMAQuestion1 === "SME") {
        jsonData = {
            time_point: header.EUDMAQuestion0,
            maturity_assessment_date: formattedDate,
            enterprise_name_edih: header.EUSMEQuestion2,
            fiscal_registration_number_vat: header.EUSMEQuestion3,
            //question EUSMEQuestion15 
            product_service_design_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 1') || '0|0',
            project_planning_and_management_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 2') || '0|0',
            operations_production_of_physical_goods_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 3') || '0|0',
            collaboration_with_other_companies_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 4') || '0|0',
            inbound_logistics_warehousing_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 5') || '0|0',
            marketing_sales_customer_management_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 6') || '0|0',
            delivery_outbound_logistics_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 7') || '0|0',
            administration_and_human_resources_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 8') || '0|0',
            purchasing_and_procurement_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 9') || '0|0',
            cyber_security_m2_1_1: questionCalc1(header.EUSMEQuestion15, 'Row 10') || '0|0',
            //question EUSMEQuestion16 
            digitalisation_needs_are_identified_m2_1_2: header.EUSMEQuestion16?.includes('Item 1') ? 1 : 0,
            financial_resources_m2_1_2: header.EUSMEQuestion16?.includes('Item 2') ? 1 : 0,
            it_infrastructures_m2_1_2: header.EUSMEQuestion16?.includes('Item 3') ? 1 : 0,
            ict_specialists_m2_1_2: header.EUSMEQuestion16?.includes('Item 4') ? 1 : 0,
            enterprise_s_management_m2_1_2: header.EUSMEQuestion16?.includes('Item 5') ? 1 : 0,
            concerned_business_departments_m2_1_2: header.EUSMEQuestion16?.includes('Item 6') ? 1 : 0,
            business_architecture_m2_1_2: header.EUSMEQuestion16?.includes('Item 7') ? 1 : 0,
            manufactured_products_m2_1_2: header.EUSMEQuestion16?.includes('Item 8') ? 1 : 0,
            clients_and_partners_satisfaction_m2_1_2: header.EUSMEQuestion16?.includes('Item 9') ? 1 : 0,
            risks_of_digitalisation_m2_1_2: header.EUSMEQuestion16?.includes('Item 10') ? 1 : 0,
            //question EUSMEQuestion17
            connectivity_infrastructure_m2_2_3: header.EUSMEQuestion17?.includes('Item 1') ? 1 : 0,
            enterprise_s_website_m2_2_3: header.EUSMEQuestion17?.includes('Item 2') ? 1 : 0,
            web_based_forms_and_blogs_m2_2_3: header.EUSMEQuestion17?.includes('Item 3') ? 1 : 0,
            live_chats_social_networks_m2_2_3: header.EUSMEQuestion17?.includes('Item 4') ? 1 : 0,
            e_commerce_sales_m2_2_3: header.EUSMEQuestion17?.includes('Item 5') ? 1 : 0,
            e_marketing_promotion_m2_2_3: header.EUSMEQuestion17?.includes('Item 6') ? 1 : 0,
            e_government_online_interaction_m2_2_3: header.EUSMEQuestion17?.includes('Item 7') ? 1 : 0,
            remote_business_collaboration_m2_2_3: header.EUSMEQuestion17?.includes('Item 8') ? 1 : 0,
            internal_web_portal_intranet_m2_2_3: header.EUSMEQuestion17?.includes('Item 9') ? 1 : 0,
            information_management_systems_m2_2_3: header.EUSMEQuestion17?.includes('Item 10') ? 1 : 0,
            //question EUSMEQuestion18
            following_advanced_digital_technologies_m2_2_4__simulation_and_digital_twins_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 1'),
            following_advanced_digital_technologies_m2_2_4__virtual_reality_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 2'),
            following_advanced_digital_technologies_m2_2_4__computer_aided_design_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 3'),
            following_advanced_digital_technologies_m2_2_4__manufacturing_execution_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 4'),
            following_advanced_digital_technologies_m2_2_4__internet_of_things_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 5'),
            following_advanced_digital_technologies_m2_2_4__blockchain_technology_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 6'),
            following_advanced_digital_technologies_m2_2_4__additive_manufacturing_m2_2_4: questionCalc2(header.EUSMEQuestion18, 'Row 7'),
            //question EUSMEQuestion19
            performs_staff_skill_m2_3_5: header.EUSMEQuestion19?.includes('Item 1') ? 1 : 0,
            designs_a_training_plan_m2_3_5: header.EUSMEQuestion19?.includes('Item 2') ? 1 : 0,
            organises_short_trainings_m2_3_5: header.EUSMEQuestion19?.includes('Item 3') ? 1 : 0,
            facilitates_learning_m2_3_5: header.EUSMEQuestion19?.includes('Item 4') ? 1 : 0,
            offers_traineeships_m2_3_5: header.EUSMEQuestion19?.includes('Item 5') ? 1 : 0,
            sponsors_staff_participation_m2_3_5: header.EUSMEQuestion19?.includes('Item 6') ? 1 : 0,
            makes_use_of_subsidised_training_m2_3_5: header.EUSMEQuestion19?.includes('Item 7') ? 1 : 0,
            //question EUSMEQuestion20
            facilitates_staff_awareness_m2_3_6: header.EUSMEQuestion20?.includes('Item 1') ? 1 : 0,
            communicates_digitalisation_m2_3_6: header.EUSMEQuestion20?.includes('Item 2') ? 1 : 0,
            monitors_staff_acceptance_m2_3_6: header.EUSMEQuestion20?.includes('Item 3') ? 1 : 0,
            involves_staff_including_m2_3_6: header.EUSMEQuestion20?.includes('Item 4') ? 1 : 0,
            gives_staff_more_autonomy_m2_3_6: header.EUSMEQuestion20?.includes('Item 5') ? 1 : 0,
            redesigns_adapts_jobs_m2_3_6: header.EUSMEQuestion20?.includes('Item 6') ? 1 : 0,
            sets_up_more_flexible_working_m2_3_6: header.EUSMEQuestion20?.includes('Item 7') ? 1 : 0,
            puts_at_staff_disposal_m2_3_6: header.EUSMEQuestion20?.includes('Item 8') ? 1 : 0,
            //question EUSMEQuestion21
            the_organisation_has_in_place_m2_4_7: header.EUSMEQuestion21?.includes('Item 1') ? 1 : 0,
            data_is_not_collected_digitally_m2_4_7: header.EUSMEQuestion21?.includes('Item 2') ? 1 : 0,
            relevant_data_m2_4_7: header.EUSMEQuestion21?.includes('Item 3') ? 1 : 0,
            data_is_properly_integrated_m2_4_7: header.EUSMEQuestion21?.includes('Item 4') ? 1 : 0,
            data_is_accessible_m2_4_7: header.EUSMEQuestion21?.includes('Item 5') ? 1 : 0,
            collected_data_m2_4_7: header.EUSMEQuestion21?.includes('Item 6') ? 1 : 0,
            data_analytics_enriched_m2_4_7: header.EUSMEQuestion21?.includes('Item 7') ? 1 : 0,
            data_analytics_accessible_m2_4_7: header.EUSMEQuestion21?.includes('Item 8') ? 1 : 0,
            //question EUSMEQuestion22
            enterprise_data_security_policy_m2_4_8: header.EUSMEQuestion22?.includes('Item 1') ? 1 : 0,
            all_client_related_data_m2_4_8: header.EUSMEQuestion22?.includes('Item 2') ? 1 : 0,
            staff_is_regularly_informed_m2_4_8: header.EUSMEQuestion22?.includes('Item 3') ? 1 : 0,
            cyber_threats_egularly_monitored_m2_4_8: header.EUSMEQuestion22?.includes('Item 4') ? 1 : 0,
            full_backup_copy_of_critical_business_data_m2_4_8: header.EUSMEQuestion22?.includes('Item 5') ? 1 : 0,
            business_continuity_plan_m2_4_8: header.EUSMEQuestion22?.includes('Item 6') ? 1 : 0,
            //question EUSMEQuestion23
            automation_and_artificial_intelligence_likert__natural_language_process_m2_5_9: questionCalc2(header.EUSMEQuestion23, 'Row 1'),
            automation_and_artificial_intelligence_likert__computer_vision_m2_5_9: questionCalc2(header.EUSMEQuestion23, 'Row 2'),
            automation_and_artificial_intelligence_likert__audio_processing_m2_5_9: questionCalc2(header.EUSMEQuestion23, 'Row 3'),
            automation_and_artificial_intelligence_likert__robotics_and_autonomous_devices_m2_5_9: questionCalc2(header.EUSMEQuestion23, 'Row 4'),
            automation_and_artificial_intelligence_likert__business_intelligence_m2_5_9: questionCalc2(header.EUSMEQuestion23, 'Row 5'),
            //question EUSMEQuestion24
            sustainable_business_model_m2_6_10: header.EUSMEQuestion24?.includes('Item 1') ? 1 : 0,
            sustainable_service_provision_m2_6_10: header.EUSMEQuestion24?.includes('Item 2') ? 1 : 0,
            sustainable_products_m2_6_10: header.EUSMEQuestion24?.includes('Item 3') ? 1 : 0,
            sustainable_production_m2_6_10: header.EUSMEQuestion24?.includes('Item 4') ? 1 : 0,
            emissions_pollution_m2_6_10: header.EUSMEQuestion24?.includes('Item 5') ? 1 : 0,
            sustainable_energy_generation_m2_6_10: header.EUSMEQuestion24?.includes('Item 6') ? 1 : 0,
            optimisation_of_raw_material_consumption_m2_6_10: header.EUSMEQuestion24?.includes('Item 7') ? 1 : 0,
            reduction_of_transport_and_packaging_costs_m2_6_10: header.EUSMEQuestion24?.includes('Item 8') ? 1 : 0,
            digital_applications_m2_6_10: header.EUSMEQuestion24?.includes('Item 9') ? 1 : 0,
            paperless_administrative_processes_m2_6_10: header.EUSMEQuestion24?.includes('Item 10') ? 1 : 0,

            //question EUSMEQuestion25
            green_digitalisation_2_likert__environmental_concerns_m2_6_11: questionCalc4(header.EUSMEQuestion25, 'Row 1'),
            green_digitalisation_2_likert__environmental_management_m2_6_11: questionCalc4(header.EUSMEQuestion25, 'Row 2'),
            green_digitalisation_2_likert__environmental_aspects_m2_6_11: questionCalc4(header.EUSMEQuestion25, 'Row 3'),
            green_digitalisation_2_likert__energy_consumption_m2_6_11: questionCalc4(header.EUSMEQuestion25, 'Row 4'),
            green_digitalisation_2_likert__recycling_reuse_m2_6_11: questionCalc4(header.EUSMEQuestion25, 'Row 5'),
        };
    }

    // create headers from JSON
    const headers: string[] = Object.keys(jsonData);

    // paste data under the headers
    let csvContent = headers.join(",") + "\n";
    headers.forEach((header: string) => {
        const value = jsonData[header] !== null && jsonData[header] !== undefined ? jsonData[header].toString().replace(/"/g, '""') : "";
        csvContent += `${value},`;
    });
    csvContent = csvContent.slice(0, -1);
    csvContent += "\n";

    // send results to the EDIH for EU-Upload
    let PSOtypes = [
        "National authority",
        "Regional authority",
        "Province/municipal authority",
        "Other"
    ];
    let PSOsize = [
        "Small-size (0-49)",
        "Medium-size (50-249)",
        "Large-size (250 or more)"
    ];
    let PSOsectors = [
        "Defence",
        "Economic affairs",
        "Education",
        "Environmental protection",
        "General public services",
        "Health",
        "Housing and community amenities",
        "Public order and safety",
        "Recreation, culture and religion",
        "Social protection"
    ];
    let SMEsize = [
        "Micro-size (1-9)",
        "Small-size (10-49)",
        "Medium-size (50-249)",
        "Large-size (250 or more)"
    ];
    let SMEsectors = [
        "Aeronautics",
        "Agricultural biotechnology and food biotechnology",
        "Automotive",
        "Community-Led Local Development",
        "Construction & Assembly",
        "Consumer products",
        "Cultural and creative economy",
        "Defence",
        "Education",
        "Electricity",
        "Energy",
        "Energy, fuels and petroleum engineering",
        "Environment",
        "Financial",
        "Fishery",
        "Food and beverages",
        "Health care",
        "Leather",
        "Legal Aspects",
        "Life sciences",
        "Manufacturing and processing",
        "Maritime",
        "Metal working and industrial production",
        "Mining and extraction",
        "NMP Non-Metallic Materials & basic processes",
        "Nuclear",
        "Paper and wood",
        "Personal services",
        "Polymers and plastics",
        "Public administration",
        "Real estate",
        "Regulation",
        "Retail, wholesale or distribution",
        "Security",
        "Smart City",
        "Space",
        "Telecommunications",
        "Textiles",
        "Tobacco",
        "Transport & Mobility",
        "Transport sector",
        "Travel and tourism"
    ];


    let sendEDIHEmail = () => {
        const base64CSV = btoa(csvContent);
        let KPI_String = ""
        if (prefix === "EUPSO") {
            if (header.EUPSOQuestion14) { KPI_String = header.EUDMAQuestionPartner + ";" + header.EUPSOQuestion2 + ";" + header.EUPSOQuestion3 + ";" + "" + ";" + header.EUPSOQuestion4 + ";" + header.EUPSOQuestion5 + ";" + header.EUPSOQuestion6 + ";" + header.EUPSOQuestion7 + ";" + header.EUPSOQuestion8 + ";" + PSOtypes[parseInt(header.EUPSOQuestion9.slice(5).trim(), 10)] + ";" + PSOsize[parseInt(header.EUPSOQuestion10.slice(5).trim(), 10)] + ";" + header.EUPSOQuestion11.text4 + ";" + header.EUPSOQuestion11.text3 + ";" + header.EUPSOQuestion11.text1 + ", " + header.EUPSOQuestion11.text2 + ", " + header.EUPSOQuestion11.text3 + ";" + PSOsectors[parseInt(header.EUPSOQuestion13.slice(5).trim(), 10)] + ";" + PSOsectors[parseInt(header.EUPSOQuestion14.slice(5).trim(), 10)] }
            else { KPI_String = header.EUDMAQuestionPartner + ";" + header.EUPSOQuestion2 + ";" + header.EUPSOQuestion3 + ";" + "" + ";" + header.EUPSOQuestion4 + ";" + header.EUPSOQuestion5 + ";" + header.EUPSOQuestion6 + ";" + header.EUPSOQuestion7 + ";" + header.EUPSOQuestion8 + ";" + PSOtypes[parseInt(header.EUPSOQuestion9.slice(5).trim(), 10)] + ";" + PSOsize[parseInt(header.EUPSOQuestion10.slice(5).trim(), 10)] + ";" + header.EUPSOQuestion11.text4 + ";" + header.EUPSOQuestion11.text3 + ";" + header.EUPSOQuestion11.text1 + ", " + header.EUPSOQuestion11.text2 + ", " + header.EUPSOQuestion11.text3 + ";" + PSOsectors[parseInt(header.EUPSOQuestion13.slice(5).trim(), 10)] }
        } else {
            if (header.EUSMEQuestion14) { KPI_String = header.EUDMAQuestionPartner + ";" + header.EUSMEQuestion2 + ";" + "" + ";" + header.EUSMEQuestion3 + ";" + "" + ";" + header.EUSMEQuestion4 + ";" + header.EUSMEQuestion5 + ";" + header.EUSMEQuestion6 + ";" + header.EUSMEQuestion7 + ";" + header.EUSMEQuestion8 + ";" + SMEsize[parseInt(header.EUSMEQuestion10.slice(5).trim(), 10)] + ";" + header.EUSMEQuestion9 + ";" + header.EUSMEQuestion11.text4 + ";" + header.EUSMEQuestion11.text3 + ";" + header.EUSMEQuestion11.text1 + ", " + header.EUSMEQuestion11.text2 + ", " + header.EUSMEQuestion11.text3 + ";" + SMEsectors[parseInt(header.EUSMEQuestion13.slice(5).trim(), 10)] + ";" + SMEsectors[parseInt(header.EUSMEQuestion14.slice(5).trim(), 10)] }
            else { KPI_String = header.EUDMAQuestionPartner + ";" + header.EUSMEQuestion2 + ";" + "" + ";" + header.EUSMEQuestion3 + ";" + "" + ";" + header.EUSMEQuestion4 + ";" + header.EUSMEQuestion5 + ";" + header.EUSMEQuestion6 + ";" + header.EUSMEQuestion7 + ";" + header.EUSMEQuestion8 + ";" + SMEsize[parseInt(header.EUSMEQuestion10.slice(5).trim(), 10)] + ";" + header.EUSMEQuestion9 + ";" + header.EUSMEQuestion11.text4 + ";" + header.EUSMEQuestion11.text3 + ";" + header.EUSMEQuestion11.text1 + ", " + header.EUSMEQuestion11.text2 + ", " + header.EUSMEQuestion11.text3 + ";" + SMEsectors[parseInt(header.EUSMEQuestion13.slice(5).trim(), 10)] }
        }

        const templateParams1 = {
            customer_name: header[`${prefix}Question2`],
            costumer_type: (prefix === "EUPSO" ? "PSO" : "SME"),
            customer_partner: header.EUDMAQuestionPartner,
            customer_contact: header[`${prefix}Question4`],
            customer_mail: header[`${prefix}Question6`],
            dma_date: formattedDate3,
            KPI_reporting: KPI_String,
            dma_results: base64CSV,
            filename: formattedDate2 + '_EDIH-Thuringia_'+(prefix === "EUPSO" ? 'PSO' : 'SME')+'-DMA_' + header[`${prefix}Question2`]
        };

        emailjs.send(service_Id_EDIH, template_Id_EDIH, templateParams1, { publicKey: public_Key })
            .then((response: any) => {
                console.log('EDIH-Email sent successfully!', response.status, response.text);
            }, (error: any) => {
                console.error('Failed to send EDIH-Email:', error);
            });
    }
    sendEDIHEmail();

    // send an automatic response to the customer
    let sendCustomerEmail = () => {
        const templateParams2 = {
            customer_name: header[`${prefix}Question2`],
            customer_contact: header[`${prefix}Question4`],
            customer_mail: header[`${prefix}Question6`],
        };

        emailjs.send(service_Id, template_Id, templateParams2, { publicKey: public_Key })
            .then((response: any) => {
                console.log('Customer-Email sent successfully!', response.status, response.text);
            }, (error: any) => {
                console.error('Failed to send Customer-Email:', error);
            });
    }
    sendCustomerEmail();
}